import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowVehicleDeals from "../components/ShowVehicleDeals";
import styles from "../components/Vehicle.module.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FaChevronLeft } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Loader from "./loader";
import AxiosUtilsConfig from "../utils/utils";

function ShowAllDealersVehicles() {
  // backend api base url
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dealerInfo, setDealerInfo] = useState({}); // State for dealer information
  const vehiclesPerPage = 8; // Define the number of vehicles per page
  const [isLoading, setIsLoading] = useState(false);
  const [dealerVehicles, setdealerVehicles] = useState([]);

  const { dealerId } = useParams();

  useEffect(() => {
    //get dealer vehicle by dealer id
    const getVehicles = async () => {
      try {
        setIsLoading(true);
        let url = `${BASE_URL}/api/car/dealerVehicles/${dealerId}?page=${currentPage}&limit=${vehiclesPerPage}`;
        const response = await axios.get(url, AxiosUtilsConfig());
        const { data } = response;
        if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
          setVehicles([]);
          setCurrentPage(1);
          setTotalPages(0);
        } else {
          const { dealerVehicles, currentPage, totalPages } = data; // Destructure from data

          setVehicles(dealerVehicles);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setDealerInfo(
            dealerVehicles.length > 0 ? dealerVehicles[0].dealerInfo : {}
          ); // Set dealer information
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getVehicles();

    //get sales of dealers by dealer id
    const getDealerVehicle = async () => {
      try {
        const url = `${BASE_URL}/api/car/salesByDealer/${dealerId}`;
        const response = await axios.get(url, AxiosUtilsConfig());

        setdealerVehicles(response.data); // Assuming setDealerVehicles is a state setter function
      } catch (error) {
        console.log(error);
      }
    };
    getDealerVehicle();
  }, [BASE_URL, dealerId, currentPage, vehiclesPerPage]);

  const columns = [
    {
      name: "Customer",
      selector: "customerInfo.customerName", // Replace with your data key
      sortable: true,
    },
    {
      name: "Customer Address",
      selector: "customerInfo.customerAddr", // Replace with your data key
      sortable: true,
    },
    {
      name: "Vehicle Model",
      selector: "modelInfo.modelName", // Replace with your data key
      sortable: true,
    },
    {
      name: "Brand",
      selector: "brandInfo.brandName", // Replace with your data key
      sortable: true,
    },
    {
      name: "Price",
      selector: "dealerVehicleInfo.price", // Replace with your data key
      sortable: true,
    },
    {
      name: "Date",
      selector: "createdAt", // Replace with your data key
      sortable: true,
    },
  ];

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#060b26", // Adjust this color to your desired dark background
        color: "#fff", // Text color for column headers
      },
    },
  };
  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loader />
        </div>
      ) : (
        <div className={styles["home-page"]}>
          <div className={styles["dealers-vehicle-profile"]}>
            <img src={dealerInfo.image} alt={vehicles.dealerName} />
          </div>
          <h1>{dealerInfo.dealerName}'s Vehicle</h1>

          <Link
            className={styles["dealer-deal"]}
            to={"/vehicle/dealer-profile"}
          >
            <span>
              <FaChevronLeft className={styles["dealer-deal-arrow"]} />
              back
            </span>
          </Link>
          <div className={styles["vehicle-grid"]}>
            {vehicles.map((vehicle) => (
              <ShowVehicleDeals key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
          <div className={styles["pagination-container"]}>
            <span>Page: {currentPage}</span>
            <div className={styles["pagination-buttons"]}>
              <button onClick={prevPage} disabled={currentPage === 1}>
                Prev Page
              </button>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next Page
              </button>
            </div>
          </div>

          <div className="table-container">
            <h2>{dealerInfo.dealerName}'s Customer Deals</h2>
            <DataTable
              columns={columns}
              data={dealerVehicles}
              pagination // Enable pagination if needed
              customStyles={customStyles} // Apply the custom styles to the table
              // Additional DataTable props can be added as needed
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ShowAllDealersVehicles;
