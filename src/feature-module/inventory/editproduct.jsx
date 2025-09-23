import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import {
  setToogleHeader,
} from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import axios from "axios";
import config from "../../config";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const EditProduct = () => {
  const MySwal = withReactContent(Swal);
  const route = all_routes;
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state.toggle_header);

  // ✅ Form state
  const [formData, setFormData] = useState({
    name: "",
    skuId: "",
    costPrice: "",
    salePrice: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${config.Backendurl}/updateitems/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      MySwal.fire({
        title: "Sucess",
        text: "Item Update Sucessfully !",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn btn-success",
        },
      });

      // Redirect to product list page
      navigate(route.productlist);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add product ❌");
    }
  };

  const renderCollapseTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Collapse
    </Tooltip>
  );

  const handlegetitem = async () => {
    try {
      const token = localStorage.getItem("token");
      let res = await axios.get(`${config.Backendurl}/itemsbyid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setFormData(res.data.data)
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add customer ❌");
    }
  }


  useEffect(() => {
    handlegetitem()
  }, [id])


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>New Product</h4>
              <h6>Create new product</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.productlist} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Back to Product
                </Link>
              </div>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                <Link
                  id="collapse-header"
                  className={data ? "active" : ""}
                  onClick={() => dispatch(setToogleHeader(!data))}
                >
                  <ChevronUp className="feather-chevron-up" />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        {/* /Add Product Form */}
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body add-product pb-0">
              <div className="accordion-card-one accordion" id="accordionExample">
                <div className="accordion-item">
                  <div className="accordion-header" id="headingOne">
                    <div
                      className="accordion-button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-controls="collapseOne"
                    >
                      <div className="addproduct-icon">
                        <h5>
                          <Info className="add-info" />
                          <span>Product Information</span>
                        </h5>
                        <Link to="#">
                          <ChevronDown className="chevron-down-add" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Product Name</label>
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">skuId</label>
                            <input
                              type="text"
                              name="skuId"
                              className="form-control"
                              value={formData.skuId}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Cost Price</label>
                              <input
                                type="number"
                                name="costPrice"
                                className="form-control"
                                value={formData.costPrice}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Unit Price</label>
                              <input
                                type="number"
                                name="salePrice"
                                className="form-control"
                                value={formData.salePrice}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <div className="col-lg-12">
              <div className="btn-addproduct mb-4">
                <Link to={route.productlist} className="btn btn-cancel me-2">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-submit">
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* /Add Product Form */}
      </div>
    </div>
  );
};

export default EditProduct;
