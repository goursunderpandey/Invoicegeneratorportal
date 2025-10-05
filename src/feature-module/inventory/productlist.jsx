import {
  ChevronUp,
  Edit,
  PlusCircle,
  RotateCcw,
  Trash2
} from "feather-icons-react/build/IconComponents";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Table from "../../core/pagination/datatable";
import { setToogleHeader } from "../../core/redux/action";
import { Download } from "react-feather";
import axios from "axios";
import config from "../../config";
import Loader from "../loader/loader";

const ProductList = () => {

  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const [dataSource, setdatasource] = useState([])
  const [loading, setLoading] = useState(false);
  const route = all_routes;

  const columns = [
    {
      title: "Product",
      dataIndex: "name",

      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "SKU",
      dataIndex: "skuId",
      sorter: (a, b) => a.skuId.length - b.skuId.length,
    },

    {
      title: "Cost Price",
      dataIndex: "costPrice",
      sorter: (a, b) => a.costPrice.length - b.costPrice.length,
    },


    {
      title: "Unit Price",
      dataIndex: "salePrice",
      sorter: (a, b) => a.salePrice.length - b.salePrice.length,
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <div className="input-block add-lists"></div>
            <Link className="me-2 p-2" to={`${route.editproduct1}/${id}`}>
              <Edit className="feather-edit" />
            </Link>

            <Link
              className="confirm-text p-2"
              to="#"
              onClick={() => showConfirmationAlert(id)}
            >
              <Trash2 className="feather-trash-2" />
            </Link>
          </div>
        </div>
      ),
      sorter: (a, b) => a.createdby.length - b.createdby.length,
    },
  ];
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = async (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {


        const token = localStorage.getItem("token");
          await axios.delete(`${config.Backendurl}/deleteitems/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update state after delete
          setdatasource((prev) => prev.filter((item) => item._id !== id));

        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          className: "btn btn-success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "btn btn-success",
          },
        });
      } else {
        MySwal.close();
      }
    });
  };

  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Printer
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );
  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const handlegetitem = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token");
      let res = await axios.get(`${config.Backendurl}/items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setdatasource(res.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      alert(err.response?.data?.error || "Failed to add customer ❌");
    }
  }


  useEffect(() => {
    handlegetitem()
  }, [])




  return (
    <>
    <Loader loading ={loading} />
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4> Product list </h4>
              <h6>Manage your products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="img"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link data-bs-toggle="tooltip" data-bs-placement="top">
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setToogleHeader(!data));
                  }}
                >
                  <ChevronUp />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link to={route.addproduct} className="btn btn-added">
              <PlusCircle className="me-2 iconsize" />
              Add New Product
            </Link>
          </div>
          <div className="page-btn import">
            <Link
              to="#"
              className="btn btn-added color"
              data-bs-toggle="modal"
              data-bs-target="#view-notes"
            >
              <Download className="me-2" />
              Import Product
            </Link>
          </div>
        </div>
        {/* /product list */}
        <div className="card table-list-card">
          <div className="card-body">


            <div className="table-responsive">
              <Table columns={columns} dataSource={dataSource} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductList;
