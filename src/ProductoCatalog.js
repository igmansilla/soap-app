
import React, { useEffect, useState } from "react";

// Simulación de un servicio SOAP para exportar a PDF
const exportToPDF = async (catalog) => {
    // En una implementación real, esto sería una llamada a un servicio SOAP
    console.log("Exportando a PDF:", catalog);
    return new Promise((resolve) =>
      setTimeout(() => resolve("URL_del_PDF"), 1000)
    );
  };
  
export const ProductCatalog = ({ storeId, userName }) => {
    const [catalogs, setCatalogs] = useState([]);
    const [selectedCatalog, setSelectedCatalog] = useState(null);
    const [newCatalogName, setNewCatalogName] = useState("");
    const [newProduct, setNewProduct] = useState({
      name: "",
      colors: "",
      sizes: "",
      photoUrl: "",
    });
    const [isExporting, setIsExporting] = useState(false);
  
    useEffect(() => {
      // Simular carga de catálogos desde el servidor
      const loadCatalogs = async () => {
        // En una implementación real, esto sería una llamada a una API
        const mockCatalogs = [
          { id: 1, name: "Remeras", products: [] },
          { id: 2, name: "Calzados", products: [] },
        ];
        setCatalogs(mockCatalogs);
      };
      loadCatalogs();
    }, [storeId]);
  
    const handleAddCatalog = () => {
      if (newCatalogName.trim()) {
        const newCatalog = {
          id: Date.now(),
          name: newCatalogName,
          products: [],
        };
        setCatalogs([...catalogs, newCatalog]);
        setNewCatalogName("");
      }
    };
  
    const handleDeleteCatalog = (catalogId) => {
      setCatalogs(catalogs.filter((catalog) => catalog.id !== catalogId));
      if (selectedCatalog && selectedCatalog.id === catalogId) {
        setSelectedCatalog(null);
      }
    };
  
    const handleSelectCatalog = (catalog) => {
      setSelectedCatalog(catalog);
    };
  
    const handleAddProduct = () => {
      if (selectedCatalog && newProduct.name.trim()) {
        const updatedCatalog = {
          ...selectedCatalog,
          products: [
            ...selectedCatalog.products,
            { ...newProduct, id: Date.now() },
          ],
        };
        setCatalogs(
          catalogs.map((cat) =>
            cat.id === selectedCatalog.id ? updatedCatalog : cat
          )
        );
        setSelectedCatalog(updatedCatalog);
        setNewProduct({ name: "", colors: "", sizes: "", photoUrl: "" });
      }
    };
  
    const handleDeleteProduct = (productId) => {
      const updatedCatalog = {
        ...selectedCatalog,
        products: selectedCatalog.products.filter(
          (product) => product.id !== productId
        ),
      };
      setCatalogs(
        catalogs.map((cat) =>
          cat.id === selectedCatalog.id ? updatedCatalog : cat
        )
      );
      setSelectedCatalog(updatedCatalog);
    };
  
    const handleExportToPDF = async () => {
      if (selectedCatalog) {
        setIsExporting(true);
        try {
          const pdfUrl = await exportToPDF(selectedCatalog);
          alert(`PDF exportado con éxito. URL: ${pdfUrl}`);
        } catch (error) {
          alert("Error al exportar a PDF");
        }
        setIsExporting(false);
      }
    };
  
    return (
      <div className="product-catalog">
        <h1>Catálogo de Productos - Tienda {storeId}</h1>
        <p>Usuario: {userName}</p>
  
        <div className="catalog-list">
          <h2>Catálogos</h2>
          <input
            type="text"
            value={newCatalogName}
            onChange={(e) => setNewCatalogName(e.target.value)}
            placeholder="Nombre del nuevo catálogo"
          />
          <button onClick={handleAddCatalog}>Agregar Catálogo</button>
          <ul>
            {catalogs.map((catalog) => (
              <li key={catalog.id}>
                <span onClick={() => handleSelectCatalog(catalog)}>
                  {catalog.name}
                </span>
                <button onClick={() => handleDeleteCatalog(catalog.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        {selectedCatalog && (
          <div className="catalog-detail">
            <h2>{selectedCatalog.name}</h2>
            <button onClick={handleExportToPDF} disabled={isExporting}>
              {isExporting ? "Exportando..." : "Exportar a PDF"}
            </button>
  
            <h3>Agregar Producto</h3>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Nombre del producto"
            />
            <input
              type="text"
              value={newProduct.colors}
              onChange={(e) =>
                setNewProduct({ ...newProduct, colors: e.target.value })
              }
              placeholder="Colores disponibles"
            />
            <input
              type="text"
              value={newProduct.sizes}
              onChange={(e) =>
                setNewProduct({ ...newProduct, sizes: e.target.value })
              }
              placeholder="Talles disponibles"
            />
            <input
              type="text"
              value={newProduct.photoUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, photoUrl: e.target.value })
              }
              placeholder="URL de la foto"
            />
            <button onClick={handleAddProduct}>Agregar Producto</button>
  
            <h3>Productos en el Catálogo</h3>
            <ul>
              {selectedCatalog.products.map((product) => (
                <li key={product.id}>
                  <h4>{product.name}</h4>
                  <p>Colores: {product.colors}</p>
                  <p>Talles: {product.sizes}</p>
                  {product.photoUrl && (
                    <img
                      src={product.photoUrl}
                      alt={product.name}
                      style={{ maxWidth: "100px" }}
                    />
                  )}
                  <button onClick={() => handleDeleteProduct(product.id)}>
                    Eliminar Producto
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  