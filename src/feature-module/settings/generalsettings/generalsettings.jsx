import { ChevronUp, PlusCircle, RotateCcw, User } from 'feather-icons-react/build/IconComponents'
import React, { useEffect, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { setToogleHeader } from '../../../core/redux/action';
import SettingsSidebar from '../settingssidebar';
import axios from 'axios';
import config from '../../../config';
import Loader from '../../loader/loader';

const GeneralSettings = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);

    // Get user from localStorage and parse it
    const storedUser = JSON.parse(localStorage.getItem('User'));

    // Initialize state with proper default values
    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        GST_NO : '',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        profileImage: '',
        UserId: storedUser?._id || '',
        email: storedUser?.email || '',
        ID: 0
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
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
                if (key !== 'profileImage' && userDetails[key] !== '' && userDetails[key] !== null) {
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

            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message || 'Profile updated successfully!' });
                setSelectedFile(null);

                // Refresh the data after successful update
                fetchUserData();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.response?.data?.error || 'Failed to update profile. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    
    const fetchUserData = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem("token");

            if (!storedUser?._id) {
                console.error('No user ID found');
                return;
            }

            const response = await axios.get(`${config.Backendurl}/auth/user-details/${storedUser._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

           // console.log('API Response:', response.data);

            if (response.data.success && response.data.data) {
                const userData = response.data.data;

                // Update user details
                setUserDetails({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    companyName: userData.companyName || '',
                    GST_NO :  userData.GST_NO || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    country: userData.country || '',
                    state: userData.state || '',
                    city: userData.city || '',
                    postalCode: userData.postalCode || '',
                    profileImage: userData.profileImage || '',
                    UserId: userData.UserId || storedUser._id,
                    email: storedUser?.email || '',
                    ID: userData._id || 0
                });

                // Handle Cloudinary image URL
                if (userData.profileImage) {
                    let imageUrl = userData.profileImage;

                    if (imageUrl.startsWith('uploads/')) {



                        const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

                        imageUrl = `${config.cloudurl}/${cleanPath}`;
                       console.log(imageUrl);
                        setPreviewImage(imageUrl);
                    } else {
                        // It's some other format, use as is
                        console.log('Other image URL:', imageUrl);
                        setPreviewImage(imageUrl);
                    }
                } else {
                    setPreviewImage('');
                }
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error('Error fetching user data:', err);
            setMessage({
                type: 'error',
                text: err.response?.data?.message || "Failed to load user data"
            });
        }
    };
    useEffect(() => {
        fetchUserData();
    }, []);

    const handleCancel = () => {
        // Reset form by fetching original data again
        fetchUserData();
        setSelectedFile(null);
        setMessage({ type: '', text: '' });
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
            <Loader loading = {loading}/>
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
                                    <Link
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        onClick={fetchUserData}
                                        style={{ cursor: 'pointer' }}
                                    >
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
                                        style={{ cursor: 'pointer' }}
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
                                                Company Information
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
                                                    <label className="form-label">Company Name *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="companyName"
                                                        value={userDetails.companyName}
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
                                            <div className="col-md-4">
                                                <div className="mb-3">
                                                    <label className="form-label">GST NO :</label>
                                                    <input
                                                        type="text"
                                                        name="GST_NO"
                                                        className="form-control"
                                                        value={userDetails.GST_NO}
                                                        onChange={handleInputChange}
                                                        disabled={loading}
                                                        
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