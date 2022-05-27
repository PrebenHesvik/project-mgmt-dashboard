import { useState } from "react";
import { useInspectionData } from "../../../../hooks/InspectionQueries";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "../../../../components/modal/Modal";
import InspectionForm from "../../InspectionForm";
import "./inspection-details.scss";

export const InspectionDetails = ({ inspectionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, data, isError, error } = useInspectionData(inspectionId);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="inspection-details">
      <div className="left">
        <div className="inspection-details-info">
          <div className="info-group">
            <p className="info-header">KUNDE</p>
            <h3 className="info-text">{data?.data["customer"]["name"]}</h3>
          </div>
        </div>
        <div className="inspection-details-info">
          <div className="info-group">
            <p className="info-header">ÅR</p>
            <h3 className="info-text">{data?.data["inspection_year"]}</h3>
          </div>
          <div className="info-group">
            <p className="info-header">MÅNED</p>
            <h3 className="info-text">{data?.data["inspection_month"]}</h3>
          </div>
        </div>
        <p className={`status ${data.data["status"]}`}>{data.data["status"]}</p>
      </div>
      <div className="right">
        <p className="description-title">BESKRIVELSE</p>
        <p className="description">{data.data["description"]}</p>
      </div>
      <EditIcon onClick={setIsOpen} />
      <Modal open={isOpen} onClose={() => closeModal()}>
        <InspectionForm
          closeModal={closeModal}
          defaults={{
            customer_id: data.data["customer"]["customer_id"],
            description: data.data["description"],
            status: data.data["status"],
            inspection_year: data.data["inspection_year"],
            inspection_month: data.data["inspection_month"],
          }}
          inspectionId={data.data["inspection_id"]}
          useInspectionData={useInspectionData}
        />
      </Modal>
    </div>
  );
};
