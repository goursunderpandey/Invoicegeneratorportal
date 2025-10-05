import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../core/breadcrumbs";
import { Link } from "react-router-dom";
import { Filter, Sliders } from "react-feather";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import Select from "react-select";
import { Edit, Globe, Trash2, User } from "react-feather";
import Table from "../../core/pagination/datatable";
import CustomerModal from "../../core/modals/peoples/customerModal";
import CustomereditModal from "../../core/modals/peoples/customereditModal";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import config from "../../config";
import Loader from "../loader/loader";

const Customers = () => {
  //const data = useSelector((state) => state.customerdata);

  const [data, setdata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevVisibility) => !prevVisibility);
  };

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "140923", label: "14 09 23" },
    { value: "110923", label: "11 09 23" },
  ];
  const optionsTwo = [
    { label: "Choose Customer Name", value: "" },
    { label: "Benjamin", value: "Benjamin" },
    { label: "Ellen", value: "Ellen" },
    { label: "Freda", value: "Freda" },
    { label: "Kaitlin", value: "Kaitlin" },
  ];

  const countries = [
    { label: "Choose Country", value: "" },
    { label: "India", value: "India" },
    { label: "USA", value: "USA" },
  ];

  const handleEditClick = (customer) => {
    let value = data.find((el) => el._id === customer)
    console.log(value, "edit");
    setEditCustomer(value);
    setShowModal(true);
  };

  const handleAddClick = () => {
    console.log(23, "edit");
    setEditCustomer(null);
    setShowModal(true);
  };

  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      sorter: (a, b) => a.companyName.length - b.companyName.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
    },

    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
    },

    {
      title: "Gst No",
      dataIndex: "gstNo",
      sorter: (a, b) => a.gstNo.length - b.gstNo.length,
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              onClick={() => handleEditClick(id)}
            >
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
    }

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
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${config.Backendurl}/deletecustomer/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update state after delete
          setdata((prev) => prev.filter((item) => item._id !== id));

          MySwal.fire({
            title: "Deleted!",
            text: "Customer has been deleted.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
        } catch (err) {
          console.error(err);
          MySwal.fire("Error", err.response?.data?.error || "Failed to delete ❌", "error");
        }
      }
    });
  };





  const handlegetdata = async () => {

    try {
      setLoading(true)
      const token = localStorage.getItem("token");

      let getdata = await axios.get(`${config.Backendurl}/getcustomer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(getdata.data.data);
      setdata(getdata.data.data)

      setLoading(false)
    } catch (err) {
      // console.error(err);
      setLoading(false)
      alert(err.response?.data?.error || "Failed to add customer ❌");
    }
  }


  useEffect(() => {
    handlegetdata()
  }, [])

  return (
    <>
      <Loader loading={loading} />
      <div className="page-wrapper">
        <div className="content">
          <Breadcrumbs
            maintitle="Customer List"
            subtitle="Manage Your Expense Category"
            addButton="Add New Customer"
            onAddClick={handleAddClick}
          />

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
                    />
                    <Link to className="btn btn-searchset">
                      <i data-feather="search" className="feather-search" />
                    </Link>
                  </div>
                </div>
                <div className="search-path">
                  <Link
                    className={`btn btn-filter ${isFilterVisible ? "setclose" : ""
                      }`}
                    id="filter_search"
                  >
                    <Filter
                      className="filter-icon"
                      onClick={toggleFilterVisibility}
                    />
                    <span onClick={toggleFilterVisibility}>
                      <ImageWithBasePath
                        src="assets/img/icons/closes.svg"
                        alt="img"
                      />
                    </span>
                  </Link>
                </div>
                <div className="form-sort stylewidth">
                  <Sliders className="info-img" />

                  <Select classNamePrefix="react-select"
                    className="img-select"
                    options={options}
                    placeholder="Sort by Date"
                  />
                </div>
              </div>
              {/* /Filter */}
              <div
                className={`card${isFilterVisible ? " visible" : ""}`}
                id="filter_inputs"
                style={{ display: isFilterVisible ? "block" : "none" }}
              >
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <User className="info-img" />
                        <Select className="img-select" classNamePrefix="react-select"
                          options={optionsTwo}
                          placeholder="Choose Customer Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Globe className="info-img" />
                        <Select className="img-select" classNamePrefix="react-select"
                          options={countries}
                          placeholder="Choose Country"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <a className="btn btn-filters ms-auto">
                          {" "}
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search{" "}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Filter */}
              <div className="table-responsive">
                <Table
                  className="table datanew"
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>
        <CustomerModal />
        <CustomereditModal show={showModal}
          onClose={() => setShowModal(false)}
          editCustomer={editCustomer}
          onSuccess={handlegetdata} />
      </div>
    </>
  );
};

export default Customers;
