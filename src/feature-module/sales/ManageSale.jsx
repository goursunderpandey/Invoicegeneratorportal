import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Calendar,
    ChevronUp,
    PlusCircle
} from "feather-icons-react/build/IconComponents";
import { setToogleHeader } from "../../core/redux/action";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import config from "../../config";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Select from "react-select";
import { DatePicker } from "antd";
import { all_routes } from "../../Router/all_routes";
import Loader from "../loader/loader";



const ManageSale = () => {
    const dispatch = useDispatch();
    const route = all_routes;
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);
    const param = useParams();

    const data = useSelector((state) => state.toggle_header);
    const [selectcustomer, setselectedcustomer] = useState('');
    const [selectedSaleType, setSelectedSaleType] = useState('Invoice')
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [customer, setcustomer] = useState([])
    const [suggestion, setsuggestion] = useState([]);
    const [searchvalue, setSearchValue] = useState("");
    const [saleType, setSaleType] = useState([]);

    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const handleSale = async (e) => {
        try {

            e.preventDefault();
            const token = localStorage.getItem("token");
            let reqobj = {
                CustomerId: selectcustomer,
                Saledate: selectedDate,
                SaleType: selectedSaleType,
                Items: selectedItems
            }

            await axios.post(`${config.Backendurl}/addSales`, reqobj, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })



            MySwal.fire({
                title: "Sucess",
                text: "Sales Inserted Sucessfully !",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "btn btn-success",
                },
            });


            navigate(route.saleslist)

            console.log(reqobj, "reqobj")
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateSale = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const token = localStorage.getItem("token");

            let reqobj = {
                CustomerId: selectcustomer,
                SaleDate: selectedDate,
                SaleType: selectedSaleType,
                Items: selectedItems,
            };

            await axios.put(`${config.Backendurl}/updatesales/${param.id}`, reqobj, {
                headers: { Authorization: `Bearer ${token}` },
            });

            MySwal.fire({
                title: "Success",
                text: "Sale Updated Successfully!",
                confirmButtonText: "OK",
                customClass: { confirmButton: "btn btn-success" },
            });

            setLoading(false)
            navigate(route.saleslist)
        } catch (error) {
            console.error(error);
            setLoading(false)
            alert(error.response?.data?.error || "Failed to update sale ❌");
        }
    };

    const handlesearch = async () => {
        try {
            const token = localStorage.getItem("token");
            let res = await axios.get(`${config.Backendurl}/searchItem?name=${searchvalue}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setsuggestion(res.data)
        } catch (err) {
            alert(err.response?.data?.error || "Failed to add customer ❌");
        }
    }

    const handleSelect = (item) => {
        setSelectedItems((prev) => {
            const existing = prev.find((i) => i.id === item._id);
            if (existing) {
                // increase qty
                return prev.map((i) =>
                    i.id === item._id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            // add new item
            return [
                ...prev,
                {
                    id: item._id,
                    name: item.name,
                    costPrice: item.costPrice,
                    salePrice: item.salePrice,
                    qty: 1,
                },
            ];
        });
        setSearchValue("");
        setsuggestion([]);
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchvalue.trim() !== "") {
                handlesearch();
            } else {
                setsuggestion([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchvalue]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const fetchdata = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token");
            let getdata = await axios.get(`${config.Backendurl}/getcustomer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log(getdata.data.data);

            let Customerdata = getdata.data.data;

            let newdata = Customerdata.map((el) => (

                {
                    label: el.companyName,
                    value: el._id

                }

            ))

            setcustomer(newdata);

            let saleTypeList = [
                {
                    label: 'Invoice',
                    value: 'Invoice'

                },
                {
                    label: 'CreditMemo',
                    value: 'CreditMemo'

                }
            ]

            setSaleType(saleTypeList)



            if (param.id) {

                let res = await axios.get(`${config.Backendurl}/allSales`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                let sale = res.data.data.find((el) => el.saleId == param.id)
                console.log(sale, "75484");

                setselectedcustomer(sale.customerId || "");
                setSelectedDate(sale.saleDate);
                setSelectedSaleType(sale.SaleType)


                setSelectedItems(
                    sale.Items?.map((item) => ({
                        id: item.id?._id,
                        name: item.id?.name,
                        costPrice: item.costPrice,
                        salePrice: item.salePrice,
                        qty: item.qty,
                    })) || []
                );
            }
            setLoading(false)

        } catch (err) {
            // console.error(err);
            setLoading(false)
            alert(err.response?.data?.error || "Failed to add customer ❌");
        }
    }
    useEffect(() => {
        fetchdata();
    }, [])
    return (
        <>
            <div>
                <Loader loading={loading} />
                <div className="page-wrapper">
                    <div className="content">
                        <div className="page-header">
                            <div className="add-item d-flex">
                                <div className="page-title">
                                    <h4>{param.id ? "Edit Sale " : "Add Sale"} </h4>
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
                                    to="#"
                                    className="btn btn-added"
                                    data-bs-toggle="modal"
                                    data-bs-target="#add-sales-new"
                                >
                                    <PlusCircle className="me-2" />
                                    Add New Sales
                                </Link>
                            </div>
                        </div>

                    </div>

                    <>

                        <div className="page-wrapper p-0 m-0">
                            <div className="content p-0">

                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={param.id ? handleUpdateSale : handleSale}>
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="input-blocks">
                                                        <label>Customer Name</label>
                                                        <div className="row">
                                                            <div className="col-lg-10 col-sm-10 col-10">
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={customer}
                                                                    placeholder="Newest"
                                                                    value={customer.find((el) => el.value === selectcustomer)}
                                                                    onChange={(e) => setselectedcustomer(e.value)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-2 col-sm-2 col-2 ps-0">
                                                                <div className="add-icon">
                                                                    <Link to={route.customers} className="choose-add">
                                                                        <PlusCircle className="plus" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="input-blocks">
                                                        <label>Date</label>
                                                        <div className="input-groupicon calender-input">
                                                            <Calendar className="info-img" />
                                                            <DatePicker
                                                                selected={selectedDate}
                                                                onChange={handleDateChange}
                                                                type="date"
                                                                className="filterdatepicker"
                                                                placeholder="Choose Date"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="input-blocks">
                                                        <label> Sale Type </label>
                                                        <div className="row">
                                                            <div className="col-lg-10 col-sm-10 col-10">
                                                                <Select
                                                                    classNamePrefix="react-select"
                                                                    options={saleType}
                                                                    placeholder="Sales Type"
                                                                    value={saleType.find((el) => el.value === selectedSaleType)}
                                                                    onChange={(e) => setSelectedSaleType(e.value)}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12 col-sm-6 col-12">
                                                    <div className="input-blocks">
                                                        <label>Product Name</label>
                                                        <div className="input-groupicon select-code">
                                                            <input
                                                                type="text"
                                                                value={searchvalue}
                                                                onChange={(e) => setSearchValue(e.target.value)}
                                                                placeholder="Please type product code and select"
                                                            />

                                                        </div>
                                                        {suggestion.length > 0 && (
                                                            <ul
                                                                className="list-group position-absolute w-100"
                                                                style={{ top: "100%", zIndex: 1000 }}
                                                            >
                                                                {suggestion.map((item) => (
                                                                    <li
                                                                        key={item._id}
                                                                        className="list-group-item list-group-item-action"
                                                                        onClick={() => handleSelect(item)}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {item.name} — {item.salePrice}$
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
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
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        min="1"
                                                                        value={el.qty}
                                                                        onChange={(e) => {
                                                                            const newQty = parseInt(e.target.value) || 1;
                                                                            setSelectedItems((prev) =>
                                                                                prev.map((item, i) =>
                                                                                    i === index ? { ...item, qty: newQty } : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>


                                                                <td>{el.costPrice}</td>


                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        min="0"
                                                                        value={el.salePrice}
                                                                        onChange={(e) => {
                                                                            const newSalePrice = parseFloat(e.target.value) || 0;
                                                                            setSelectedItems((prev) =>
                                                                                prev.map((item, i) =>
                                                                                    i === index ? { ...item, salePrice: newSalePrice } : item
                                                                                )
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>


                                                                <td>{(el.qty * el.salePrice).toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="row">
                                                <div className="col-lg-6 ms-auto">
                                                    <div className="total-order w-100 max-widthauto m-auto mb-4">
                                                        <ul>
                                                            <li>
                                                                <h4>Grand Total</h4>
                                                                <h5>{selectedItems.reduce((acc, curr) => {
                                                                    return acc + curr.qty * curr.salePrice;
                                                                }, 0)}</h5>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn btn-primary"> {param.id ? "Edit Sale" : "Save "} </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                </div>
            </div>
        </>
    )
}

export default ManageSale
