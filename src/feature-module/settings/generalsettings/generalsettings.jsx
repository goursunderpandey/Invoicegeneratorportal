import { ChevronUp, PlusCircle, RotateCcw, User } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setToogleHeader } from '../../../core/redux/action';
import SettingsSidebar from '../settingssidebar';
import axios from 'axios';
import config from '../../../config';

const GeneralSettings = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

    // Get user from localStorage and parse it
    const storedUser = JSON.parse(localStorage.getItem('User'));

    // Initialize state with proper default values
    const [userDetails, setUserDetails] = useState({
        firstName: storedUser?.firstName || '',
        lastName: storedUser?.lastName || '',
        userName: storedUser?.userName || '',
        phone: storedUser?.phone || '',
        address: storedUser?.address || '',
        country: storedUser?.country || '',
        state: storedUser?.state || '',
        city: storedUser?.city || '',
        postalCode: storedUser?.postalCode || '',
        profileImage: storedUser?.profileImage || '',
        UserId: storedUser?._id || '',
        email: storedUser?.email || '',
        ID : 0
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(storedUser?.profileImage || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 5MB' });
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(file.type)) {
                setMessage({ type: 'error', text: 'Only JPG, JPEG, and PNG files are allowed' });
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target.result);
            };
            reader.readAsDataURL(file);
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();

            // Append all user details to formData
            Object.keys(userDetails).forEach(key => {
                if (key !== 'profileImage' && userDetails[key] !== '') {
                    formData.append(key, userDetails[key]);
                }
            });

            // Append the file if selected
            if (selectedFile) {
                formData.append('profileImage', selectedFile);
            }

            // Make API call to your backend
            const response = await axios.post(`${config.Backendurl}/auth/add-user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                setSelectedFile(null);


            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update profile. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const handleGetData = async () => {
            try {
                const token = localStorage.getItem("token");

                let getdata = await axios.get(`${config.Backendurl}/auth/user-details/${storedUser?._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                console.log(getdata.data.data);
                setUserDetails({...getdata.data.data,ID:getdata.data.data?._id})
                setPreviewImage(`${config.Imageurl}/${getdata.data.data.profileImage}`)


            } catch (err) {
                // console.error(err);
                alert(err.response?.data?.error || "Failed to add customer ❌");
            }
        }

        handleGetData()
    }, [])

    const handleCancel = () => {
        // Reset form to original values
        if (storedUser) {
            setUserDetails({
                firstName: storedUser?.firstName || '',
                lastName: storedUser?.lastName || '',
                userName: storedUser?.userName || '',
                phone: storedUser?.phone || '',
                address: storedUser?.address || '',
                country: storedUser?.country || '',
                state: storedUser?.state || '',
                city: storedUser?.city || '',
                postalCode: storedUser?.postalCode || '',
                profileImage: storedUser?.profileImage || '',
                UserId: storedUser?._id || '',
                email: storedUser?.email || ''
            });
            setPreviewImage(storedUser.profileImage || '');
            setSelectedFile(null);
            setMessage({ type: '', text: '' });
        }
    };

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

    return (
        <div>
            <div className="page-wrapper">
                <div className="content settings-content">
                    <div className="page-header settings-pg-header">
                        <div className="add-item d-flex">
                            <div className="page-title">
                                <h4>Settings</h4>
                                <h6>Manage your settings on portal</h6>
                            </div>
                        </div>
                        <ul className="table-top-head">
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
                                        onClick={() => { dispatch(setToogleHeader(!data)) }}
                                    >
                                        <ChevronUp />
                                    </Link>
                                </OverlayTrigger>
                            </li>
                        </ul>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                            {message.text}
                        </div>
                    )}

                    <div className="row">
                        <div className="col-xl-12">
                            <div className="settings-wrapper d-flex">
                                <SettingsSidebar />
                                <div className="settings-page-wrap">
                                    <form onSubmit={handleSubmit}>
                                        <div className="setting-title">
                                            <h4>Profile Settings</h4>
                                        </div>
                                        <div className="card-title-head">
                                            <h6>
                                                <span>
                                                    <User className="feather-chevron-up" />
                                                </span>
                                                Employee Information
                                            </h6>
                                        </div>
                                        <div className="profile-pic-upload">
                                            <div className="profile-pic">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt="Profile Preview"
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <span>
                                                        <PlusCircle className="plus-down-add" />
                                                        Profile Photo
                                                    </span>
                                                )}
                                            </div>
                                            <div className="new-employee-field">
                                                <div className="mb-0">
                                                    <div className="image-upload mb-0">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png"
                                                            onChange={handleFileChange}
                                                            disabled={loading}
                                                        />
                                                        <div className="image-uploads">
                                                            <h4>Change Image</h4>
                                                        </div>
                                                    </div>
                                                    <span>
                                                        For better preview recommended size is 450px x 450px. Max
                                                        size 5MB. Only JPG, JPEG, PNG allowed.
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">First Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="firstName"
                                                        value={userDetails.firstName}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Last Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="lastName"
                                                        value={userDetails.lastName}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">User Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="userName"
                                                        value={userDetails.userName}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="phone"
                                                        value={userDetails.phone}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        value={userDetails.email}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-title-head">
                                            <h6>
                                                <span>
                                                    <i data-feather="map-pin" className="feather-chevron-up" />
                                                </span>
                                                Our Address
                                            </h6>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Address</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="address"
                                                        value={userDetails.address}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-3">
                                                <div className="mb-3">
                                                    <label className="form-label">Country</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="country"
                                                        value={userDetails.country}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-3">
                                                <div className="mb-3">
                                                    <label className="form-label">State / Province</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="state"
                                                        value={userDetails.state}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-3">
                                                <div className="mb-3">
                                                    <label className="form-label">City</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="city"
                                                        value={userDetails.city}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-3 col-lg-4 col-md-3">
                                                <div className="mb-3">
                                                    <label className="form-label">Postal Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="postalCode"
                                                        value={userDetails.postalCode}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-end settings-bottom-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                onClick={handleCancel}
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-submit"
                                                disabled={loading}
                                            >
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralSettings