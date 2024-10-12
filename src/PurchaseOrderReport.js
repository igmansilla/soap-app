import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

const initialPurchaseOrders = [
  { id: "PO001", productCode: "PROD001", quantity: 100, orderDate: "2023-05-01", status: "Pendiente", store: "Tienda A" },
  { id: "PO002", productCode: "PROD002", quantity: 50, orderDate: "2023-05-03", status: "Aprobada", store: "Tienda B" },
  { id: "PO003", productCode: "PROD001", quantity: 75, orderDate: "2023-05-05", status: "Rechazada", store: "Tienda C" },
  { id: "PO004", productCode: "PROD003", quantity: 200, orderDate: "2023-05-07", status: "Pendiente", store: "Tienda A" },
  { id: "PO005", productCode: "PROD002", quantity: 150, orderDate: "2023-05-09", status: "Aprobada", store: "Tienda B" },
];

function DatePickerWithRange({ date, setDate }) {
  return (
    <div>
      <input
        type="date"
        value={date?.from ? format(date.from, 'yyyy-MM-dd') : ''}
        onChange={(e) => setDate({ from: new Date(e.target.value), to: date?.to })}
      />
      <input
        type="date"
        value={date?.to ? format(date.to, 'yyyy-MM-dd') : ''}
        onChange={(e) => setDate({ ...date, to: new Date(e.target.value) })}
      />
    </div>
  );
}

 export default function PurchaseOrderReport() {
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [productCode, setProductCode] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [status, setStatus] = useState("");
  const [store, setStore] = useState("");
  const [customFilters, setCustomFilters] = useState([]);
  const [newFilterName, setNewFilterName] = useState("");
  const [editingFilter, setEditingFilter] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserFromCentralOffice, setIsUserFromCentralOffice] = useState(true);

  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const filtered = purchaseOrders.filter((order) => {
      return (
        (productCode === "" || order.productCode.toLowerCase().includes(productCode.toLowerCase())) &&
        (status === "" || order.status === status) &&
        (store === "" || order.store === store) &&
        (!dateRange.from || new Date(order.orderDate) >= dateRange.from) &&
        (!dateRange.to || new Date(order.orderDate) <= dateRange.to)
      );
    });
    setFilteredOrders(filtered);
  }, [purchaseOrders, productCode, dateRange, status, store]);

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const key = `${order.productCode}-${order.status}-${order.store}`;
    if (!acc[key]) {
      acc[key] = { ...order, totalQuantity: 0 };
    }
    acc[key].totalQuantity += order.quantity;
    return acc;
  }, {});

  const saveFilter = () => {
    if (editingFilter) {
      setCustomFilters(customFilters.map(filter => 
        filter.id === editingFilter.id 
          ? { ...filter, name: newFilterName, productCode, dateRange, status, store } 
          : filter
      ));
      setEditingFilter(null);
    } else {
      const newFilter = {
        id: Date.now().toString(),
        name: newFilterName,
        productCode,
        dateRange,
        status,
        store,
      };
      setCustomFilters([...customFilters, newFilter]);
    }
    setNewFilterName("");
    setIsDialogOpen(false);
  };

  const applyFilter = (filter) => {
    setProductCode(filter.productCode);
    setDateRange(filter.dateRange);
    setStatus(filter.status);
    setStore(filter.store);
  };

  const editFilter = (filter) => {
    setEditingFilter(filter);
    setNewFilterName(filter.name);
    setIsDialogOpen(true);
  };

  const deleteFilter = (filterId) => {
    setCustomFilters(customFilters.filter(filter => filter.id !== filterId));
  };

  const clearFilters = () => {
    setProductCode("");
    setDateRange({ from: null, to: null });
    setStatus("");
    setStore("");
  };

  return (
    <div className="container">
      <h1 className="title">Informe de Órdenes de Compra</h1>
      <div className="filters">
        <div>
          <label htmlFor="productCode">Código de Producto</label>
          <input
            id="productCode"
            type="text"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            placeholder="Ingrese código"
          />
        </div>
        <div>
          <label>Rango de Fechas</label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div>
          <label htmlFor="status">Estado</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>
        {isUserFromCentralOffice && (
          <div>
            <label htmlFor="store">Tienda</label>
            <select id="store" value={store} onChange={(e) => setStore(e.target.value)}>
              <option value="">Todas</option>
              <option value="Tienda A">Tienda A</option>
              <option value="Tienda B">Tienda B</option>
              <option value="Tienda C">Tienda C</option>
            </select>
          </div>
        )}
      </div>
      <div className="actions">
        <button onClick={clearFilters}>Limpiar Filtros</button>
        <button onClick={() => setIsDialogOpen(true)}>Guardar Filtro</button>
      </div>
      {isDialogOpen && (
        <div className="modal">
          <h2>{editingFilter ? "Editar Filtro" : "Guardar Filtro"}</h2>
          <input
            type="text"
            value={newFilterName}
            onChange={(e) => setNewFilterName(e.target.value)}
            placeholder="Nombre del filtro"
          />
          <button onClick={saveFilter}>
            {editingFilter ? "Actualizar" : "Guardar"}
          </button>
          <button onClick={() => setIsDialogOpen(false)}>Cancelar</button>
        </div>
      )}
      <div className="saved-filters">
        <h2>Filtros Guardados</h2>
        <div>
          {customFilters.map((filter) => (
            <div key={filter.id} className="filter-item">
              <button onClick={() => applyFilter(filter)}>{filter.name}</button>
              <button onClick={() => editFilter(filter)}>Editar</button>
              <button onClick={() => deleteFilter(filter.id)}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Código de Producto</th>
            <th>Estado</th>
            <th>Tienda</th>
            <th>Cantidad Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedOrders).map((order) => (
            <tr key={`${order.productCode}-${order.status}-${order.store}`}>
              <td>{order.productCode}</td>
              <td>
                <span
                  className={`status ${
                    order.status === "Pendiente"
                      ? "pending"
                      : order.status === "Aprobada"
                      ? "approved"
                      : "rejected"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td>{order.store}</td>
              <td>{order.totalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}