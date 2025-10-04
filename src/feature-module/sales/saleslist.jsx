import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";

import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  ChevronUp,
  PlusCircle
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../core/pagination/datatable";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { all_routes } from "../../Router/all_routes";




const SalesList = () => {
  //const saleslistdata = saleslist;
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const Companyinformation = useSelector((state) => state.Companyinformation);
  const [saleslistdata, setsaleslistdata] = useState([]);
  const [currentSale, setCurrentSale] = useState(null);
  const [imageUrl, setimageUrl] = useState("")
  const [selectedItems, setSelectedItems] = useState([]);



  // Put this OUTSIDE SalesList
  const ExportPDF = (sale) => {

    try {


      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Sale Invoice", 14, 20);

      // Customer Info
      doc.setFontSize(12);
      doc.text(`Customer: ${sale.customerName}`, 14, 30);
      doc.text(`Email: ${sale.customerEmail}`, 14, 37);
      doc.text(`Sale Date: ${new Date(sale.saleDate).toLocaleDateString()}`, 14, 44);
      doc.text(`Sale ID: ${sale.saleId}`, 14, 51);

      // Table
      const tableColumn = ["Product", "Qty", "Cost Price", "Unit Price", "Total"];
      const tableRows = [];

      sale.Items.forEach((item) => {
        const row = [
          item.name,
          item.qty,
          `$${item.costPrice}`,
          `$${item.salePrice}`,
          `$${(item.qty * item.salePrice).toFixed(2)}`,
        ];
        tableRows.push(row);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
      });


      // Grand Total
      doc.text(
        `Grand Total: $${sale.Items.reduce(
          (acc, curr) => acc + curr.qty * curr.salePrice,
          0
        )}`,
        14,
        doc.lastAutoTable.finalY + 10
      );

      // Save
      doc.save("sale_invoice.pdf");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  const [searchText, setSearchText] = useState("");
  const filteredData = saleslistdata.filter((entry) => {
    return Object.keys(entry).some((key) => {
      return String(entry[key])
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  });

  useEffect(() => {
    if (Companyinformation.profileImage) {
      let imageUrl = Companyinformation.profileImage;

      if (imageUrl.startsWith('uploads/')) {

        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

        imageUrl = `${config.cloudurl}/${cleanPath}`;
        console.log(imageUrl);
        setimageUrl(imageUrl)

      } else {
        // It's some other format, use as is
        console.log('Other image URL:', imageUrl);

      }
    }
  }, [])

  const handlegetSaledata = async () => {

    try {
      const token = localStorage.getItem("token");
      let res = await axios.get(`${config.Backendurl}/allSales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setsaleslistdata(res.data.data)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add customer ❌");
    }
  }

  useEffect(() => {
    handlegetSaledata()
  }, [])

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );
  const MySwal = withReactContent(Swal);

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
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
  const columns = [
    {
      title: "SaleId",
      dataIndex: "saleId",
    },
    {
      title: "CustomerName",
      dataIndex: "customerName",
      sorter: (a, b) => a.customerName.length - b.customerName.length,
    },
    {
      title: "CustomerEmail",
      dataIndex: "customerEmail",
      sorter: (a, b) => a.customerEmail.length - b.customerEmail.length,
    },

    {
      title: "Date",
      dataIndex: "saleDate",
      render: (date) => moment(date).format("YYYY/MM/DD"),
      sorter: (a, b) => moment(a.saleDate).unix() - moment(b.saleDate).unix(),
    },
    {
      title: "GrandTotal",
      dataIndex: "total",
      sorter: (a, b) => a.total.length - b.total.length,
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div className="text-center">
          <Link className="action-set" to="#" data-bs-toggle="dropdown" aria-expanded="true">
            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="#" className="dropdown-item"
                data-bs-toggle="modal"
                data-bs-target="#sales-details-new"
                onClick={() => {
                  setCurrentSale(record)
                  setSelectedItems(
                    record.Items?.map((item) => ({
                      id: item.id?._id,
                      name: item.id?.name,
                      costPrice: item.costPrice,
                      salePrice: item.salePrice,
                      qty: item.qty,
                    })) || []
                  );
                }}><i data-feather="eye" className="feather-eye me-2"></i>Sale Detail</Link>
            </li>
            <li>
              <Link
                to={`${route.manageSales}/${record?.saleId}`}
                className="dropdown-item"

              >
                <i data-feather="edit" className="feather-edit me-2"></i>Edit Sale
              </Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item" onClick={() => ExportPDF(record)}>
                <i data-feather="download" className="feather-edit me-2">
                </i>Download pdf</Link>
            </li>
            <li>
              <Link to="#" className="dropdown-item confirm-text mb-0" onClick={showConfirmationAlert}><i data-feather="trash-2" className="feather-trash me-2"  ></i>Delete Sale</Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];




  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Sales List</h4>
                <h6>Manage Your Sales</h6>
              </div>
            </div>
            <ul className="table-top-head">

              <li>
                <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                  <Link
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    id="collapse-header"
                    className={data ? "active" : ""}
                    onClick={() => {
                      dispatch(setToogleHeader(!data));
                    }}
                  >
                    <ChevronUp />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
            <div className="page-btn">
              <Link
                to={route.manageSales}
                className="btn btn-added"
              >
                <PlusCircle className="me-2" />
                Add New Sales
              </Link>
            </div>
          </div>
          {/* /product list */}
          <div className="card table-list-card">
            <div className="card-body">
              <div className="table-top">
                <div className="search-set">
                  <div className="search-input">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control form-control-sm formsearch"
                      aria-controls="DataTables_Table_0"
                      value={searchText}
                      onChange={handleSearch}
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>


              </div>


              <div className="table-responsive">
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
      </div>
      <>

        {/* details popup */}
        <div className="modal fade" id="sales-details-new">
          <div className="modal-dialog sales-details-modal">
            <div className="modal-content">
              <div className="page-wrapper details-blk">
                <div className="content p-0">
                  <div className="page-header p-4 mb-0">
                    <div className="add-item d-flex">
                      <div className="page-title modal-datail">
                        <h4>Sales Detail : {currentSale?.saleId}</h4>
                      </div>

                    </div>
                    <ul className="table-top-head">

                      <button
                        type="button"
                        className="close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>

                    </ul>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <form>
                        <div
                          className="invoice-box table-height"

                        >

                          <div className="d-flex">

                            <div className=" justify-contect-center">
                              <Link to="/dashboard" className="logo logo-normal">
                                <ImageWithBasePath src={imageUrl} alt="img" />
                              </Link>
                            </div>

                          </div>


                          <div className="sales-details-items d-flex">
                            <div className="details-item">
                              <h6>Customer Info</h6>
                              <p>
                                Name : {currentSale?.customerName}
                                <br />
                                Email {currentSale?.customerEmail}
                                <br />
                                phoneNumber :  {currentSale?.customerphoneNumber}
                                <br />
                                Address : {currentSale?.customerAddress}
                                <br />
                                GST NO : {currentSale?.customergstNo}
                              </p>
                            </div>
                          </div>
                          <h5 className="order-text">Order Summary</h5>
                          <div className="table-responsive no-pagination">
                            <table className="table datanew">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Qty</th>
                                  <th>Purchase Price ($)</th>
                                  <th>Unit Cost ($)</th>
                                  <th>Total Cost ($)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedItems.map((el, index) => (
                                  <tr key={index}>
                                    {/* Product Name */}
                                    <td>{el.name}</td>

                                    {/* Qty Editable */}
                                    <td>
                                      {el.qty}
                                    </td>


                                    <td>{el.costPrice}</td>


                                    <td>
                                      {el.salePrice}
                                    </td>


                                    <td>{(el.qty * el.salePrice).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row">
                          <div className="row">
                            <div className="col-lg-6 ms-auto">
                              <div className="total-order w-100 max-widthauto m-auto mb-4">
                                <ul>

                                  <li>
                                    <h4>Grand Total</h4>
                                    <h5>{selectedItems.reduce((acc, curr) => {
                                      return acc + curr.qty * curr.salePrice;
                                    }, 0).toFixed(2)}</h5>
                                  </li>

                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /details popup */}
        <div className="customizer-links" id="setdata">
          <ul className="sticky-sidebar">
            <li className="sidebar-icons">
              <Link
                to="#"
                className="navigation-add"
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                data-bs-original-title="Theme"
              >
                <i data-feather="settings" className="feather-five" />
              </Link>
            </li>
          </ul>
        </div>
      </>
    </div>
  );
};

export default SalesList;
