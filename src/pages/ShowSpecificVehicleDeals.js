import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowVehicleDeals from "../components/ShowVehicleDeals";
import styles from "../components/Vehicle.module.css";
import Brandlist from "../components/Brandlist";
import { useParams } from "react-router-dom";
import Loader from "../components/loader";
import AxiosUtilsConfig from "../utils/utils";

function ShowSpecificVehicleDeals() {
  // backend api base url
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modelInfo, setModelInfo] = useState({}); // State for dealer information
  const vehiclesPerPage = 8; // Define the number of vehicles per page
  const [isLoading, setIsLoading] = useState(false);

  const { modelId } = useParams();

  useEffect(() => {
    const getVehicles = async () => {
      try {
        setIsLoading(true);
        let url = `${BASE_URL}/api/car/dealerVehicle/${modelId}?page=${currentPage}&limit=${vehiclesPerPage}`;

        const response = await axios.get(url, AxiosUtilsConfig());
        const { data } = response; // Destructure the response

        if (!data.dealerVehicles || data.dealerVehicles.length === 0) {
          setVehicles([]);
          setCurrentPage(1);
          setTotalPages(0);
          setIsLoading(false);
        } else {
          const { dealerVehicles, currentPage, totalPages } = data; // Destructure from data

          setVehicles(dealerVehicles);
          setCurrentPage(currentPage);
          setTotalPages(totalPages);
          setModelInfo(
            dealerVehicles.length > 0 ? dealerVehicles[0].modelInfo : {}
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    getVehicles();
  }, [BASE_URL, modelId, currentPage, vehiclesPerPage]);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
          <h1 style={{ fontWeight: "900", color: " rgb(102, 98, 98)" }}>
            {modelInfo.modelName}'s Dealers{" "}
          </h1>
          {/* Consider rendering a specific vehicle's image */}
          {/* <img src={vehicles.modelName} alt={vehicles.modelName} /> */}

          <Brandlist />
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
        </div>
      )}
    </>
  );
}

export default ShowSpecificVehicleDeals;
