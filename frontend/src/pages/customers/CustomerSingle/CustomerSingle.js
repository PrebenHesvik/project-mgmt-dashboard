import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCustomerData } from "../../../hooks/customerQueries";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import EditIcon from "@mui/icons-material/Edit";
import CustomerForm from "../CustomerForm";
import Modal from "../../../components/modal/Modal";
import "./customer-single.scss";

const CustomerSingle = () => {
  const location = useLocation();
  const customerId = location.pathname.split("/").pop();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, isError, data, error } = useCustomerData(customerId);

  const closeModal = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return <span>is loading</span>;
  }

  if (isError) {
    return <span>{error}</span>;
  }

  return (
    <div id="customer-single-page">
      <div className="customer-details">
        <div className="header">
          <h3 className="name">{data?.data["name"]}</h3>
          <p className="region">
            {data?.data["is_active"] ? "Aktiv" : "Inaktiv"}
          </p>
        </div>
        <div className="body">
          <div className="info">
            <PublicIcon />
            <p className="info-text">
              {data?.data["region_name"]} - {data?.data["municipality"]}
            </p>
          </div>
          <div className="info">
            <LocationOnIcon />
            <span className="info-text">{data?.data["street"]}</span>
            <span className="info-text">{data?.data["postal_code"]}</span>
            <span className="info-text">{data?.data["postal_name"]}</span>
          </div>
          <div className="created-by">
            <span>Created</span>
            <span className="key-value">{data?.data["date_created"]} </span>
            <span>by</span>
            <span className="key-value">
              {data?.data["created_by_employee"]["name"]}
            </span>
          </div>
          {data?.data["date_updated"] ? (
            <div className="updated-by">
              <span>Updated</span>
              <span className="key-value">{data?.data["date_updated"]}</span>
              <span>by</span>
              <span className="key-value">
                {data?.data["updated_by_employee"]["name"]}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <EditIcon className="edit-button" onClick={setIsOpen} />
      </div>
      <Modal open={isOpen} onClose={() => closeModal()}>
        <CustomerForm
          closeModal={closeModal}
          defaults={{
            name: data.data["name"],
            street: data.data["street"],
            postal_code: data.data["postal_code"],
            postal_name: data.data["postal_name"],
            municipality: data.data["municipality"],
            region_name: data.data["region_name"],
            is_active: data.data["is_active"],
          }}
          customerId={data?.data["customer_id"]}
        />
      </Modal>
    </div>
  );
};

export default CustomerSingle;
