import React from "react";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductAdmin from "../Components/ProductAdmin/ProductAdmin";

import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProdutcs] = useState([]);
  const [moreratingProducts, setMoreRatingProducts] = useState([]);
  const [moreSoldProducts, setMoreSoldProducts] = useState([]);
  const [ratingProducts, setRatingProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedSizeTShirt, setSelectedSizeTShirt] = useState("all");
  const [selectedSizeBike, setSelectedSizeBike] = useState("all");
  const [selectedSizeAdidas, setSelectedSizeAdidas] = useState("all");
  const [selectedSizePants, setSelectedSizePants] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [seeMoreRate, setSeeMoreRate] = useState(null);
  const [seeMoreSold, setSeeMoreSold] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/productAll");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/productFeedBackEachRating`
        );
        setFeedbacks(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Error fetching feedbacks");
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/CheckoutPurchaseTop5SoldProducts"
        );
        setSoldProdutcs(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/top5FeedBackProducts"
        );
        setRatingProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/SeeMoreFeedBackProducts"
        );
        setMoreRatingProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/SeeMoreSoldProducts"
        );
        setMoreSoldProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);

    if (filter === "name") {
      const sortedProducts = [...products].sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      setFilteredProducts(sortedProducts);
    } else if (filter === "price") {
      const sortedProducts = [...products].sort(
        (a, b) => a.productPrice - b.productPrice
      );
      setFilteredProducts(sortedProducts);
    } else if (filter === "quantity") {
      const sortedProducts = [...products].sort(
        (a, b) => a.productQuantity - b.productQuantity
      );
      setFilteredProducts(sortedProducts);
    }
  };

  const handleSearchInputChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredProducts = products.filter((product) => {
      return (
        product.productName.toLowerCase().includes(searchTerm) ||
        product.productDescription.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredProducts(filteredProducts);
  };

  const handleViewProduct = (productId) => {
    const selectedProduct = products.find(
      (product) => product.productId === parseInt(productId, 10)
    );

    if (selectedProduct) {
      const { productId, ...rest } = selectedProduct;

      navigate({
        pathname: `/viewproductadmin/${productId}`,
        state: { product: rest },
      });
    }
  };

  const handleAdd = () => {
    navigate("/addproduct");
  };

  const handleLogOut = () => {
    navigate("/login");
  };

  const handleViewClients = () => {
    navigate("/viewclients");
  };

  const handleEdit = (event, productId) => {
    const selectedProduct = products.find(
      (product) => product.productId === parseInt(productId, 10)
    );

    event.stopPropagation();

    if (selectedProduct) {
      const { productId, ...rest } = selectedProduct;

      navigate({
        pathname: `/editproduct/${productId}`,
        state: { product: rest },
      });
    }
  };

  const handleDelete = async (event, productId) => {
    event.stopPropagation();
    try {
      const response = await axios.delete(
        `http://localhost:8080/productDelete?ProductId=${productId}`
      );

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSeeMoreRate = () => {
    setSeeMoreRate(!seeMoreRate);
  };

  const handleSeeMoreSold = () => {
    setSeeMoreSold(!seeMoreSold);
  };

  const handleFilterChange = (
    category,
    priceRange,
    sizeTShirt,
    sizeAdidas,
    sizePants,
    sizeBike
  ) => {
    console.log("Category:", category);
    console.log("Price Range:", priceRange);
    console.log("Size T-Shirt:", sizeTShirt);
    console.log("Size Adidas:", sizeAdidas);

    setFilterType(category);
    setSelectedPriceRange(priceRange);
    setSelectedSizeTShirt(sizeTShirt);
    setSelectedSizeAdidas(sizeAdidas);
    setSelectedSizePants(sizePants);
    setSelectedSizeBike(sizeBike);

    // Filter products based on category, price range, and T-shirt size (if applicable)
    const filteredProducts = products.filter((product) => {
      const categoryMatch = !category || product.productCategory === category;
      const priceMatch =
        priceRange === "all" ||
        (priceRange === "lessThan100" && product.productPrice < 100) ||
        (priceRange === "lessThan200" && product.productPrice < 200) ||
        (priceRange === "lessThan400" && product.productPrice < 400) ||
        (priceRange === "lessThan600" && product.productPrice < 600) ||
        (priceRange === "lessThan800" && product.productPrice < 800);

      let sizeMatch = true;

      if (category === "tricou") {
        console.log("Product Category:", product.productCategory);
        console.log("Product Size:", product.productCategoryTShirtSize);
        console.log("Selected Size:", sizeTShirt);
        if (
          product.productCategoryTShirtSize !== undefined &&
          sizeTShirt !== "all"
        ) {
          const sizeRegex = new RegExp(`\\b${sizeTShirt}\\b`);
          if (Array.isArray(product.productCategoryTShirtSize)) {
            sizeMatch = product.productCategoryTShirtSize.some((size) =>
              sizeRegex.test(size)
            );
          } else {
            sizeMatch = sizeRegex.test(product.productCategoryTShirtSize);
          }
        }
      }

      let sizeMatchB = true;

      if (category === "bicicleta") {
        console.log("Product Category:", product.productCategory);
        console.log("Product Size:", product.productCategoryBikeSize);
        console.log("Selected Size:", sizeBike);
        if (
          product.productCategoryBikeSize !== undefined &&
          sizeBike !== "all"
        ) {
          const sizeRegex = new RegExp(`\\b${sizeBike}\\b`);
          if (Array.isArray(product.productCategoryBikeSize)) {
            sizeMatchB = product.productCategoryBikeSize.some((size) =>
              sizeRegex.test(size)
            );
          } else {
            sizeMatchB = sizeRegex.test(product.productCategoryBikeSize);
          }
        }
      }

      let sizeMatchAdidas = true;

      if (category === "adidas") {
        console.log("Product Category:", product.productCategory);
        console.log("Product Size:", product.productCategoryAdidasSize);
        console.log("Selected Size:", sizeAdidas);
        if (
          product.productCategoryAdidasSize !== undefined &&
          sizeAdidas !== "all"
        ) {
          const sizeRegex = new RegExp(`\\b${sizeAdidas}\\b`);
          if (Array.isArray(product.productCategoryAdidasSize)) {
            sizeMatchAdidas = product.productCategoryAdidasSize.some((size) =>
              sizeRegex.test(size)
            );
          } else {
            sizeMatchAdidas = sizeRegex.test(product.productCategoryAdidasSize);
          }
        }
      }

      let sizeMatchPants = true;

      if (category === "pantaloni") {
        console.log("Product Category:", product.productCategory);
        console.log("Product Size:", product.productCategoryPantsSize);
        console.log("Selected Size:", sizeAdidas);
        if (
          product.productCategoryPantsSize !== undefined &&
          sizePants !== "all"
        ) {
          const sizeRegex = new RegExp(`\\b${sizePants}\\b`);
          if (Array.isArray(product.productCategoryPantsSize)) {
            sizeMatchPants = product.productCategoryPantsSize.some((size) =>
              sizeRegex.test(size)
            );
          } else {
            sizeMatchPants = sizeRegex.test(product.productCategoryPantsSize);
          }
        }
      }

      return (
        categoryMatch &&
        priceMatch &&
        sizeMatch &&
        sizeMatchAdidas &&
        sizeMatchPants &&
        sizeMatchB
      );
    });

    // Set the filtered products
    setFilteredProducts(filteredProducts);
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ paddingLeft: "3%", paddingRight: "3%" }}
    >
      <h2 className="my-5 text-center"> Here are the products! </h2>

      <button
        onClick={handleAdd}
        className="btn btn-primary btn-half mx-auto d-block"
        style={{ marginBottom: "20px" }}
      >
        Add
      </button>

      <button
        onClick={handleLogOut}
        className="btn btn-primary btn-half mx-auto d-block"
        style={{ marginBottom: "20px" }}
      >
        Log out
      </button>

      <button
        onClick={handleViewClients}
        className="btn btn-primary btn-half mx-auto d-block"
        style={{ marginBottom: "70px" }}
      >
        View Clients
      </button>

      <div style={{ marginLeft: "18%", marginRight: "13%" }}>
        <h2>Top 5 rated Products</h2>

        <ul
          className="d-flex flex-wrap align-items-center justify-content-around "
          style={{ height: "100%" }}
        >
          {ratingProducts.map((product) => (
            <li
              key={product.productFeedbackProductId}
              className="flex-basis-25 mb-4"
              style={{
                width: "23%",
                height: "400px",
                boxShadow:
                  "0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",
                borderRadius: "15px ",
                marginRight: "2%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                handleViewProduct(product.productFeedbackProductId)
              }
            >
              <p>
                <img
                  src={product.productImage}
                  style={{
                    width: "150px",
                    height: "175px",
                    marginTop: "25px",
                  }}
                  alt="productimage"
                />
              </p>
              <h3 className="product-namead">{product.productName}</h3>
              <p>{product.productDescription}</p>

              <p>Price: ${product.productPrice}</p>

              {feedbacks.some(
                (feedback) =>
                  feedback.productFeedbackProductId ===
                  product.productFeedbackProductId
              ) && (
                <p>
                  {" "}
                  Rating:{" "}
                  {
                    feedbacks.find(
                      (feedback) =>
                        feedback.productFeedbackProductId ===
                        product.productFeedbackProductId
                    ).productFeedbackRating
                  }
                </p>
              )}
            </li>
          ))}
        </ul>

        {seeMoreRate && (
          <ul
            className="d-flex flex-wrap align-items-center justify-content-around"
            style={{ height: "100%" }}
          >
            {moreratingProducts.map((product) => (
              <li
                key={product.productFeedbackProductId}
                className="flex-basis-25 mb-4"
                style={{
                  width: "23%",
                  height: "400px",
                  boxShadow:
                    "0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",
                  borderRadius: "15px",
                  marginRight: "2%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleViewProduct(product.productFeedbackProductId)
                }
              >
                <p>
                  <img
                    src={product.productImage}
                    style={{
                      width: "150px",
                      height: "175px",
                      marginTop: "25px",
                    }}
                    alt="productimage"
                  />
                </p>
                <h3 className="product-namead">{product.productName}</h3>
                <p>{product.productDescription}</p>
                <p>Price: ${product.productPrice}</p>
                {feedbacks.some(
                  (feedback) =>
                    feedback.productFeedbackProductId ===
                    product.productFeedbackProductId
                ) && (
                  <p>
                    {" "}
                    Rating:{" "}
                    {
                      feedbacks.find(
                        (feedback) =>
                          feedback.productFeedbackProductId ===
                          product.productFeedbackProductId
                      ).productFeedbackRating
                    }
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSeeMoreRate}
          className="btn btn-primary btn-half mx-auto d-block"
          style={{ marginBottom: "20px", width: "15%" }}
        >
          {seeMoreRate ? "See less" : "See more"}
        </button>
      </div>

      <div style={{ marginLeft: "18%", marginRight: "13%" }}>
        <h2>Top 5 sold Products</h2>

        <ul
          className="d-flex flex-wrap align-items-center justify-content-around "
          style={{ height: "100%" }}
        >
          {soldProducts.map((product) => (
            <li
              key={product.productId}
              className="flex-basis-25 mb-4"
              style={{
                width: "23%",
                boxShadow:
                  "0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",
                borderRadius: "15px ",
                marginRight: "2%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                height: "400px",
              }}
              onClick={() => handleViewProduct(product.productId)}
            >
              <p>
                <img
                  src={product.productImage}
                  style={{
                    width: "175px",
                    height: "175px",
                    marginTop: "25px",
                  }}
                  alt="productimage"
                />
              </p>
              <h3 className="product-namead">{product.productName}</h3>
              <p>
                {product.productCategory === "tricou"
                  ? `${product.productDescription} - Size: ${product.productCategoryTShirtSize}`
                  : product.productCategory === "adidas"
                  ? `${product.productDescription} - Size: ${product.productCategoryAdidasSize}`
                  : product.productCategory === "pantaloni"
                  ? `${product.productDescription} - Size: ${product.productCategoryPantsSize}`
                  : product.productDescription}
              </p>
              <p>Price: ${product.productPrice}</p>
            </li>
          ))}
        </ul>

        {seeMoreSold && (
          <ul
            className="d-flex flex-wrap align-items-center justify-content-around"
            style={{ height: "100%" }}
          >
            {moreSoldProducts.map((product) => (
              <li
                key={product.productFeedbackProductId}
                className="flex-basis-25 mb-4"
                style={{
                  width: "23%",
                  height: "400px",
                  boxShadow:
                    "0px -3px 4px 0px rgba(107, 126, 190, 0.04), 0px 8px 16px 0px rgba(107, 126, 190, 0.16)",
                  borderRadius: "15px",
                  marginRight: "2%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleViewProduct(product.productFeedbackProductId)
                }
              >
                <p>
                  <img
                    src={product.productImage}
                    style={{
                      width: "150px",
                      height: "175px",
                      marginTop: "25px",
                    }}
                    alt="productimage"
                  />
                </p>
                <h3 className="product-namead">{product.productName}</h3>
                <p>
                  {product.productCategory === "tricou"
                    ? `${product.productDescription} - Size: ${product.productCategoryTShirtSize}`
                    : product.productCategory === "adidas"
                    ? `${product.productDescription} - Size: ${product.productCategoryAdidasSize}`
                    : product.productCategory === "pantaloni"
                    ? `${product.productDescription} - Size: ${product.productCategoryPantsSize}`
                    : product.productDescription}
                </p>
                <p>Price: ${product.productPrice}</p>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSeeMoreSold}
          className="btn btn-primary btn-half mx-auto d-block"
          style={{ marginBottom: "20px", width: "15%" }}
        >
          {seeMoreSold ? "See less" : "See more"}
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "15%",
            fontSize: "20px",
            paddingTop: "14%",
          }}
        >
          <div className="input text-center">
            <h3>Search for products!</h3>
            <input
              type="text"
              style={{ marginBottom: "30px" }}
              value={searchTerm}
              onChange={handleSearchInputChange}
              placeholder="Search products"
            />
          </div>

          <div
            className="dropdown text-center "
            style={{ marginBottom: "40px" }}
          >
            <button
              className="btn btn-secondary dropdown-toggle "
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Select filter!
            </button>
            <ul className="dropdown-menu">
              <li
                className="dropdown-item"
                onClick={() => handleFilterClick("name")}
              >
                Filter by name
              </li>
              <li
                className="dropdown-item"
                onClick={() => handleFilterClick("price")}
              >
                Filter by price
              </li>
              <li
                className="dropdown-item"
                onClick={() => handleFilterClick("quantity")}
              >
                Filter by quantity
              </li>
            </ul>
          </div>

          <div
            className="radio-buttons text-center"
            style={{
              marginBottom: "40px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4>Type Of Products</h4>
            <div>
              <input
                type="radio"
                id="all"
                name="productType"
                value=""
                checked={filterType === ""}
                onChange={() =>
                  handleFilterChange(
                    "",
                    selectedPriceRange,
                    selectedSizeTShirt,
                    selectedSizeAdidas,
                    selectedSizePants,
                    selectedSizeBike
                  )
                }
              />
              <label htmlFor="all">All</label>
            </div>
            <div>
              <input
                type="radio"
                id="tricou"
                name="productType"
                value="tricou"
                checked={filterType === "tricou"}
                onChange={() =>
                  handleFilterChange(
                    "tricou",
                    selectedPriceRange,
                    selectedSizeTShirt,
                    selectedSizeAdidas,
                    selectedSizePants,
                    selectedSizeBike
                  )
                }
              />
              <label htmlFor="tricou">Tricou</label>
            </div>
            <div>
              <input
                type="radio"
                id="bicicleta"
                name="productType"
                value="Bicicleta"
                checked={filterType === "bicicleta"}
                onChange={() =>
                  handleFilterChange(
                    "bicicleta",
                    selectedPriceRange,
                    selectedSizeTShirt,
                    selectedSizeAdidas,
                    selectedSizePants,
                    selectedSizeBike
                  )
                }
              />
              <label htmlFor="bicicleta">Bicicleta</label>
            </div>
            <div>
              <input
                type="radio"
                id="adidas"
                name="productType"
                value="adidas"
                checked={filterType === "adidas"}
                onChange={() =>
                  handleFilterChange(
                    "adidas",
                    selectedPriceRange,
                    selectedSizeTShirt,
                    selectedSizeAdidas,
                    selectedSizePants,
                    selectedSizeBike
                  )
                }
              />
              <label htmlFor="adidas">Adidas</label>
              <div>
                <input
                  type="radio"
                  id="pantaloni"
                  name="productType"
                  value="pantaloni"
                  checked={filterType === "pantaloni"}
                  onChange={() =>
                    handleFilterChange(
                      "pantaloni",
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="pantaloni">Pants</label>
              </div>
            </div>
          </div>

          <h4>Price Filter</h4>
          <div>
            <input
              type="radio"
              id="allPrices"
              name="priceRange"
              value="all"
              checked={selectedPriceRange === "all"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "all",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="allPrices">All Prices</label>
          </div>
          <div>
            <input
              type="radio"
              id="lessThan100"
              name="priceRange"
              value="lessThan100"
              checked={selectedPriceRange === "lessThan100"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "lessThan100",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="lessThan100">Less than $100</label>
          </div>
          <div>
            <input
              type="radio"
              id="lessThan200"
              name="priceRange"
              value="lessThan200"
              checked={selectedPriceRange === "lessThan200"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "lessThan200",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="lessThan200">Less than $200</label>
          </div>
          <div>
            <input
              type="radio"
              id="lessThan400"
              name="priceRange"
              value="lessThan400"
              checked={selectedPriceRange === "lessThan400"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "lessThan400",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="lessThan400">Less than $400</label>
          </div>
          <div>
            <input
              type="radio"
              id="lessThan600"
              name="priceRange"
              value="lessThan600"
              checked={selectedPriceRange === "lessThan600"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "lessThan600",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="lessThan600">Less than $600</label>
          </div>
          <div>
            <input
              type="radio"
              id="lessThan800"
              name="priceRange"
              value="lessThan800"
              checked={selectedPriceRange === "lessThan800"}
              onChange={() =>
                handleFilterChange(
                  filterType,
                  "lessThan800",
                  selectedSizeTShirt,
                  selectedSizeAdidas,
                  selectedSizePants,
                  selectedSizeBike
                )
              }
            />
            <label htmlFor="lessThan800">Less than $800</label>
          </div>

          {filterType === "tricou" && (
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>T-Shirt Size Filter</h4>
              <div>
                <input
                  type="radio"
                  id="allSizesTShirt"
                  name="sizeTShirtrange"
                  value="allSizesTShirt"
                  checked={selectedSizeTShirt === "all"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      "all",
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="allSizesTShirt">All Sizes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="M"
                  name="sizeTShirtrange"
                  value="M"
                  checked={selectedSizeTShirt === "M"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      "M",
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="M">M</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="L"
                  name="sizeTShirtrange"
                  value="L"
                  checked={selectedSizeTShirt === "L"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      "L",
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="L">L</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="XL"
                  name="sizeTShirtrange"
                  value="XL"
                  checked={selectedSizeTShirt === "XL"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      "XL",
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="XL">XL</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="XXL"
                  name="sizeTShirtrange"
                  value="XXL"
                  checked={selectedSizeTShirt === "XXL"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      "XXL",
                      selectedSizeAdidas,
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="XXL">XXL</label>
              </div>
            </div>
          )}

          {filterType === "bicicleta" && (
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Bike Size Filter</h4>
              <div>
                <input
                  type="radio"
                  id="allSizesBike"
                  name="sizeBikerange"
                  value="allSizesBike"
                  checked={selectedSizeBike === "all"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      "all"
                    )
                  }
                />
                <label htmlFor="allSizesBike">All Sizes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="M"
                  name="sizeBikerange"
                  value="M"
                  checked={selectedSizeBike === "M"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      "M"
                    )
                  }
                />
                <label htmlFor="M">M</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="L"
                  name="sizeBikerange"
                  value="L"
                  checked={selectedSizeBike === "L"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      "L"
                    )
                  }
                />
                <label htmlFor="L">L</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="XL"
                  name="sizeBikerange"
                  value="XL"
                  checked={selectedSizeBike === "XL"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      "XL"
                    )
                  }
                />
                <label htmlFor="XL">XL</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="XXL"
                  name="sizeBikerange"
                  value="XXL"
                  checked={selectedSizeBike === "XXL"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      selectedSizePants,
                      "XXL"
                    )
                  }
                />
                <label htmlFor="XXL">XXL</label>
              </div>
            </div>
          )}

          {filterType === "adidas" && (
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Adidas Size Filter</h4>
              <div>
                <input
                  type="radio"
                  id="allSizesAdidas"
                  name="sizeAdidas"
                  value="allSizesAdidas"
                  checked={selectedSizeAdidas === "all"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "all",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="allSizesAdidas">All Sizes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="35"
                  name="sizeAdidas"
                  value="35"
                  checked={selectedSizeAdidas === "35"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "35",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="35">35</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="36"
                  name="sizeAdidas"
                  value="36"
                  checked={selectedSizeAdidas === "36"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "36",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="36">36</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="37"
                  name="sizeAdidas"
                  value="37"
                  checked={selectedSizeAdidas === "37"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "37",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="37">37</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="38"
                  name="sizeAdidas"
                  value="38"
                  checked={selectedSizeAdidas === "38"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "38",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="38">38</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="39"
                  name="sizeAdidas"
                  value="39"
                  checked={selectedSizeAdidas === "39"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "39",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="39">39</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="40"
                  name="sizeAdidas"
                  value="40"
                  checked={selectedSizeAdidas === "40"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "40",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="40">40</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="41"
                  name="sizeAdidas"
                  value="41"
                  checked={selectedSizeAdidas === "41"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "41",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="41">41</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="42"
                  name="sizeAdidas"
                  value="42"
                  checked={selectedSizeAdidas === "42"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "42",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="42">42</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="43"
                  name="sizeAdidas"
                  value="43"
                  checked={selectedSizeAdidas === "43"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedPriceRange,
                      "43",
                      selectedSizePants,
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="43">43</label>
              </div>
            </div>
          )}

          {filterType === "pantaloni" && (
            <div
              style={{
                marginTop: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h4>Pants Size Filter</h4>
              <div>
                <input
                  type="radio"
                  id="allSizesPants"
                  name="sizePantsrange"
                  value="allSizesPants"
                  checked={selectedSizePants === "all"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "all",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="allSizesPants">All Sizes</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="36"
                  name="sizePantsrange"
                  value="36"
                  checked={selectedSizePants === "36"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "36",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="36">36</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="38"
                  name="sizePantsrange"
                  value="38"
                  checked={selectedSizePants === "38"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "38",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="38">38</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="40"
                  name="sizePantsrange"
                  value="40"
                  checked={selectedSizePants === "40"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "40",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="40">40</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="42"
                  name="sizePantsrange"
                  value="42"
                  checked={selectedSizePants === "42"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "42",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="42">42</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="44"
                  name="sizePantsrange"
                  value="44"
                  checked={selectedSizePants === "44"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "44",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="44">44</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="46"
                  name="sizePantsrange"
                  value="46"
                  checked={selectedSizePants === "46"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "46",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="46">46</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="48"
                  name="sizePantsrange"
                  value="48"
                  checked={selectedSizePants === "48"}
                  onChange={() =>
                    handleFilterChange(
                      filterType,
                      selectedPriceRange,
                      selectedSizeTShirt,
                      selectedSizeAdidas,
                      "48",
                      selectedSizeBike
                    )
                  }
                />
                <label htmlFor="48">48</label>
              </div>
            </div>
          )}
        </div>

        <div style={{ width: "85%" }}>
          <h2 style={{ marginBottom: "50px", marginLeft: "35px" }}>
            All Products
          </h2>
          <ul
            className="d-flex flex-wrap align-items-center justify-content-around "
            style={{ height: "100%" }}
          >
            {filteredProducts.length === 0 ? (
              <h2 style={{ color: "red", textAlign: "center" }}>
                No products found.
              </h2>
            ) : (
              filteredProducts.map((product) => (
                <ProductAdmin
                  key={product.productId}
                  handleViewProduct={handleViewProduct}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  product={product}
                  feedbacks={feedbacks}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
