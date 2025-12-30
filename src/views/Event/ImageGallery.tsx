import * as React from "react";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { EventImages } from "../../types/interfaces";
import helpers from "../../_helpers/common";

interface props {
  eventImages: EventImages[] | null;
  is_recuring?: number;
}

const ImageGallery: React.FC<props> = ({ eventImages, is_recuring }) => {
  const [open, setOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);

  // Convert eventImages -> SlideImage[]
  const slides =
    eventImages?.map((img) => ({
      src: img.filepath,
    })) || [];

  return (
    <>
      <div className="d-flex gap-3 flex-wrap">
        {eventImages?.map((item, index) => (

          //Image card
          <div key={index} className="card card-bordered" style={{ width: "180px" }}>
            {is_recuring === 1 ? (
              <div
                className="card-header ribbon ribbon-end ribbon-clip d-flex justify-content-between align-items-center p-2"
                style={{ minHeight: "42px" }}
              >
                <div className="card-title fs-6 fw-bold m-0">Event Date</div>
                <div className="ribbon-label">
                  {item?.event_date
                    ? helpers.convertDateTime(item?.event_date, "DD MMM YYYY")
                    : "Invalid date"}
                  <span className="ribbon-inner bg-info"></span>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="card-img-top">
              <img
                src={item.filepath}
                alt={`event-${index}`}
                className="rounded cursor-pointer"
                style={{ width: "100%", height: "120px", objectFit: "cover" }}
                onClick={() => {
                  setCurrentIndex(index);
                  setOpen(true);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
      />
    </>
  );
};

export default ImageGallery;
