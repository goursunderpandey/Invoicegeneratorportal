import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment";


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
import Loader from "../loader/loader";




const SalesList = () => {
  //const saleslistdata = saleslist;
  const route = all_routes;
  const dispatch = useDispatch();
  const data = useSelector((state) => state.toggle_header);
  const Companyinformation = useSelector((state) => state.Companyinformation);
  const storedUser = JSON.parse(localStorage.getItem('User'));
  const [saleslistdata, setsaleslistdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [imageUrl, setimageUrl] = useState("")
  const [selectedItems, setSelectedItems] = useState([]);

  console.log(Companyinformation, "CompanyInfo");

  const ExportPDF = (sale) => {
    try {
      const doc = new jsPDF();

      // ========== HEADER ==========
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${Companyinformation.companyName}`, 14, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${Companyinformation?.address}`, 14, 28);
      doc.text(`Email: ${storedUser?.email} | Phone: ${Companyinformation?.phone}`, 14, 34);
      doc.text(`Gst No : ${Companyinformation.GST_NO}`, 14, 40);


      if (Companyinformation.profileImage) {
        let imageUrl = Companyinformation.profileImage;
        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
        imageUrl = `${config.cloudurl}/${cleanPath}`;

        doc.addImage(imageUrl, "PNG", 150, 10, 40, 20);
      }

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(`${sale.SaleType}`, 160, 40); // move below logo

      // ========== CUSTOMER & INVOICE INFO ==========
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 55);
      doc.setFont("helvetica", "normal");
      doc.text(`${sale.customerName}`, 14, 61);
      doc.text(`${sale.customerEmail}`, 14, 67);
      doc.text(`${sale.customergstNo}`, 14, 73);

      doc.setFont("helvetica", "bold");
      doc.text(`${sale.SaleType} Details:`, 140, 55);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${new Date(sale.saleDate).toLocaleDateString()}`, 140, 61);

      // ========== ITEMS TABLE ==========
      const tableColumn = ["#", "Description", "Qty", "Unit Price", "Total"];
      const tableRows = [];

      sale.Items.forEach((item, idx) => {
        const row = [
          idx + 1,
          item.name,
          item.qty,
          `${item.salePrice.toFixed(2)}`,
          `${(item.qty * item.salePrice).toFixed(2)}`,
        ];
        tableRows.push(row);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }, // Blue header
        bodyStyles: { fontSize: 10 },
      });

      const finalY = doc.lastAutoTable.finalY || 90;

      // ========== TOTALS ==========
      const subtotal = sale.Items.reduce((acc, curr) => acc + curr.qty * curr.salePrice, 0);
      const grandTotal = subtotal;

      doc.setFontSize(11);
      doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 160, finalY + 10);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Total: ${grandTotal.toFixed(2)}`, 160, finalY + 16);

      // ========== FOOTER ==========
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Thank you for your business!", 14, finalY + 40);
      doc.text("Payment due within 15 days.", 14, finalY + 46);

      // Save file
      doc.save(`${sale.SaleType}_${sale.saleId}.pdf`);
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
      setLoading(true)
      const token = localStorage.getItem("token");
      let res = await axios.get(`${config.Backendurl}/allSales`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setsaleslistdata(res.data.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
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
      render: (_, record, index) => {
        const prefix = record.SaleType === "Invoice" ? "INV" : "CR";
        return `${prefix} ${String(index + 1).padStart(2, "0")}`;
      },
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
      <Loader loading={loading} />
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
                  <div className="page-header p-4 mb-0 d-flex justify-content-between mt-3">
                    {/* Left - Company Info */}
                    <div>
                      <h4 className="mb-1">{Companyinformation?.companyName}</h4>
                      <p className="mb-0 small">
                        {Companyinformation?.address} <br />
                        Email: {storedUser?.email} | Phone: {Companyinformation?.phone} <br />
                        GST No: {Companyinformation?.GST_NO}
                      </p>
                    </div>

                    {/* Right - Logo + Sale Type */}
                    <div className="text-end">
                     
                        <img
                          src={imageUrl}
                          alt="Company Logo"
                          style={{ maxHeight: "100px", marginBottom: "5px" }}
                        />
                      
                      <h5 className="fw-bold mb-0">{currentSale?.SaleType}</h5>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>

                  <div className="card">
                    <div className="card-body">
                      {/* Customer Info */}
                      <div className="mb-4">
                        <h6 className="fw-bold">Bill To:</h6>
                        <p className="mb-0">
                          Name: {currentSale?.customerName} <br />
                          Email: {currentSale?.customerEmail} <br />
                          Phone: {currentSale?.customerphoneNumber} <br />
                          Address: {currentSale?.customerAddress} <br />
                          GST No: {currentSale?.customergstNo}
                        </p>
                      </div>

                      {/* Items Table */}
                      <h6 className="fw-bold">Order Summary</h6>
                      <div className="table-responsive no-pagination">
                        <table className="table table-bordered align-middle">
                          <thead className="table-primary">
                            <tr>
                              <th>#</th>
                              <th>Product</th>
                              <th>Qty</th>
                              <th>Purchase Price (₹)</th>
                              <th>Unit Cost (₹)</th>
                              <th>Total (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedItems.map((el, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{el.name}</td>
                                <td>{el.qty}</td>
                                <td>{el.costPrice}</td>
                                <td>{el.salePrice}</td>
                                <td>{(el.qty * el.salePrice).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Totals */}
                      <div className="d-flex justify-content-end mt-3">
                        <div className="text-end">
                          <h6 className="fw-bold mb-1">Subtotal:</h6>
                          <p>
                            ₹
                            {selectedItems
                              .reduce((acc, curr) => acc + curr.qty * curr.salePrice, 0)
                              .toFixed(2)}
                          </p>
                          <h6 className="fw-bold mb-1">Total:</h6>
                          <h5 className="fw-bold text-primary">
                            ₹
                            {selectedItems
                              .reduce((acc, curr) => acc + curr.qty * curr.salePrice, 0)
                              .toFixed(2)}
                          </h5>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4">
                        <p className="fst-italic small">
                          Thank you for your business! <br />
                          Payment is due within 15 days.
                        </p>
                      </div>
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
