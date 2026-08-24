import { useState } from "react";
import {
  FiHome,
  FiPercent,
  FiPrinter,
  FiDatabase,
  FiSave,
} from "react-icons/fi";
import "./settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("restaurant");

  const [restaurant, setRestaurant] = useState({
    name: "shubham",
    phone: "",
    address: "sonai mumbai",
    fssai: "",
    gstin: "",
  });

  const [gstSettings, setGstSettings] = useState({
    gstEnabled: true,
    cgst: "2.5",
    sgst: "2.5",
    serviceChargeEnabled: false,
    serviceCharge: "5",
    packagingChargeEnabled: false,
    packagingCharge: "20",
    taxInclusive: true,
  });

  const handleRestaurantChange = (e) => {
    setRestaurant({
      ...restaurant,
      [e.target.name]: e.target.value,
    });
  };

  const handleGstChange = (e) => {
    const { name, value, type, checked } = e.target;

    setGstSettings({
      ...gstSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const saveRestaurant = () => {
    console.log("Restaurant Settings:", restaurant);
    alert("Restaurant details saved successfully!");
  };

  const saveGstSettings = () => {
    console.log("GST Settings:", gstSettings);
    alert("GST & charges saved successfully!");
  };

  const settingsTabs = [
    {
      id: "restaurant",
      label: "Restaurant Details",
      icon: <FiHome />,
    },
    {
      id: "gst",
      label: "GST & Charges",
      icon: <FiPercent />,
    },
    {
      id: "printer",
      label: "Receipt Printer",
      icon: <FiPrinter />,
    },
    {
      id: "database",
      label: "Database & Sync",
      icon: <FiDatabase />,
    },
  ];

  return (
    <div className="settings-page">

      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Configure your restaurant.</p>
        </div>
      </div>

      <div className="settings-container">

        <div className="settings-sidebar">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-tab-icon">
                {tab.icon}
              </span>

              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === "restaurant" && (
            <>
              <div className="content-header">
                <h2>Restaurant Profile Details</h2>
              </div>

              <div className="form-content">

                <div className="form-row">

                  <div className="form-group">
                    <label>RESTAURANT NAME *</label>

                    <input
                      type="text"
                      name="name"
                      value={restaurant.name}
                      onChange={handleRestaurantChange}
                      placeholder="Restaurant name"
                    />
                  </div>

                  <div className="form-group">
                    <label>CONTACT PHONE NUMBER *</label>

                    <input
                      type="text"
                      name="phone"
                      value={restaurant.phone}
                      onChange={handleRestaurantChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                </div>

                <div className="form-group full-width">
                  <label>ADDRESS *</label>

                  <input
                    type="text"
                    name="address"
                    value={restaurant.address}
                    onChange={handleRestaurantChange}
                    placeholder="Restaurant address"
                  />
                </div>

                <div className="form-row">

                  <div className="form-group">
                    <label>FSSAI LICENSE NUMBER</label>

                    <input
                      type="text"
                      name="fssai"
                      value={restaurant.fssai}
                      onChange={handleRestaurantChange}
                      placeholder="14-digit FSSAI number"
                      maxLength={14}
                    />
                  </div>

                  <div className="form-group">
                    <label>GSTIN ID</label>

                    <input
                      type="text"
                      name="gstin"
                      value={restaurant.gstin}
                      onChange={handleRestaurantChange}
                      placeholder="15-digit GSTIN"
                      maxLength={15}
                    />
                  </div>

                </div>

              </div>

              <div className="save-section">
                <button
                  className="save-button"
                  onClick={saveRestaurant}
                >
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab === "gst" && (
            <>
              <div className="content-header">
                <h2>GST & Charges</h2>
              </div>

              <div className="gst-content">


                <div className="settings-section">

                  <div className="section-heading">
                    <div>
                      <h3>GST Configuration</h3>
                      <p>
                        Configure GST rates applied to restaurant bills.
                      </p>
                    </div>

                    <label className="switch">
                      <input
                        type="checkbox"
                        name="gstEnabled"
                        checked={gstSettings.gstEnabled}
                        onChange={handleGstChange}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  {gstSettings.gstEnabled && (
                    <div className="form-row gst-rate-row">

                      <div className="form-group">
                        <label>CGST (%)</label>

                        <div className="input-with-symbol">
                          <input
                            type="number"
                            name="cgst"
                            value={gstSettings.cgst}
                            onChange={handleGstChange}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span>%</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>SGST (%)</label>

                        <div className="input-with-symbol">
                          <input
                            type="number"
                            name="sgst"
                            value={gstSettings.sgst}
                            onChange={handleGstChange}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span>%</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>


                <div className="settings-section">

                  <div className="section-heading">

                    <div>
                      <h3>Service Charge</h3>
                      <p>
                        Add a service charge to restaurant bills.
                      </p>
                    </div>

                    <label className="switch">
                      <input
                        type="checkbox"
                        name="serviceChargeEnabled"
                        checked={gstSettings.serviceChargeEnabled}
                        onChange={handleGstChange}
                      />
                      <span className="slider"></span>
                    </label>

                  </div>

                  {gstSettings.serviceChargeEnabled && (
                    <div className="single-setting">

                      <div className="form-group">
                        <label>SERVICE CHARGE (%)</label>

                        <div className="input-with-symbol">
                          <input
                            type="number"
                            name="serviceCharge"
                            value={gstSettings.serviceCharge}
                            onChange={handleGstChange}
                            min="0"
                            max="100"
                            step="0.5"
                          />

                          <span>%</span>
                        </div>
                      </div>

                    </div>
                  )}

                </div>


                <div className="settings-section">

                  <div className="section-heading">

                    <div>
                      <h3>Packaging Charge</h3>
                      <p>
                        Add an additional charge for takeaway packaging.
                      </p>
                    </div>

                    <label className="switch">
                      <input
                        type="checkbox"
                        name="packagingChargeEnabled"
                        checked={gstSettings.packagingChargeEnabled}
                        onChange={handleGstChange}
                      />
                      <span className="slider"></span>
                    </label>

                  </div>

                  {gstSettings.packagingChargeEnabled && (
                    <div className="single-setting">

                      <div className="form-group">
                        <label>PACKAGING CHARGE (₹)</label>

                        <div className="input-with-symbol">
                          <span>₹</span>

                          <input
                            type="number"
                            name="packagingCharge"
                            value={gstSettings.packagingCharge}
                            onChange={handleGstChange}
                            min="0"
                            step="1"
                          />
                        </div>
                      </div>

                    </div>
                  )}

                </div>


                <div className="settings-section">

                  <div className="section-heading">

                    <div>
                      <h3>Tax Display</h3>
                      <p>
                        Choose how tax is handled in menu prices.
                      </p>
                    </div>

                  </div>

                  <div className="tax-options">

                    <label
                      className={`tax-option ${
                        gstSettings.taxInclusive
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="taxInclusive"
                        checked={gstSettings.taxInclusive}
                        onChange={() =>
                          setGstSettings({
                            ...gstSettings,
                            taxInclusive: true,
                          })
                        }
                      />

                      <div>
                        <strong>Tax Inclusive</strong>
                        <span>
                          Menu prices already include GST.
                        </span>
                      </div>
                    </label>

                    <label
                      className={`tax-option ${
                        !gstSettings.taxInclusive
                          ? "selected"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="taxInclusive"
                        checked={!gstSettings.taxInclusive}
                        onChange={() =>
                          setGstSettings({
                            ...gstSettings,
                            taxInclusive: false,
                          })
                        }
                      />

                      <div>
                        <strong>Tax Exclusive</strong>
                        <span>
                          GST is added separately to the bill.
                        </span>
                      </div>
                    </label>

                  </div>

                </div>

              </div>

              <div className="save-section">
                <button
                  className="save-button"
                  onClick={saveGstSettings}
                >
                  <FiSave />
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeTab === "printer" && (
  <>
    <div className="content-header">
      <h2>Receipt Printer</h2>
    </div>

    <div className="printer-content">

      <div className="settings-section">

        <div className="section-heading">
          <div>
            <h3>Printer Configuration</h3>
            <p>
              Configure the printer used for customer receipts.
            </p>
          </div>
        </div>

        <div className="form-row printer-row">

          <div className="form-group">
            <label>PRINTER TYPE</label>

            <select className="settings-select">
              <option>Thermal Printer</option>
              <option>Standard Printer</option>
              <option>PDF / Digital Receipt</option>
            </select>
          </div>

          <div className="form-group">
            <label>PAPER SIZE</label>

            <select className="settings-select">
              <option>80mm</option>
              <option>58mm</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label>PRINTER NAME</label>

          <input
            type="text"
            placeholder="Enter printer name"
          />
        </div>

      </div>

      <div className="settings-section">

        <div className="section-heading">
          <div>
            <h3>Printing Options</h3>
            <p>
              Control when receipts are printed automatically.
            </p>
          </div>
        </div>

        <div className="printer-options">

          <label className="printer-option">
            <div>
              <strong>Auto Print Receipt</strong>
              <span>
                Automatically print the receipt after payment.
              </span>
            </div>

            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </label>

          <label className="printer-option">
            <div>
              <strong>Print Kitchen Order</strong>
              <span>
                Automatically print orders for the kitchen.
              </span>
            </div>

            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </label>

          <label className="printer-option">
            <div>
              <strong>Print Customer Copy</strong>
              <span>
                Print a customer copy after successful payment.
              </span>
            </div>

            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </label>

        </div>

      </div>

      <div className="settings-section">

        <div className="section-heading">
          <div>
            <h3>Printer Test</h3>
            <p>
              Check whether your printer is connected correctly.
            </p>
          </div>
        </div>

        <button
          className="test-print-button"
          onClick={() => alert("Test print sent successfully!")}
        >
          <FiPrinter />
          Test Print
        </button>

      </div>

    </div>

    <div className="save-section">
      <button
        className="save-button"
        onClick={() => alert("Printer settings saved successfully!")}
      >
        <FiSave />
        Save Changes
      </button>
    </div>
  </>
)}

{activeTab === "database" && (
  <>
    <div className="content-header">
      <h2>Database & Sync</h2>
    </div>

    <div className="database-content">


      <div className="settings-section">

        <div className="section-heading">
          <div>
            <h3>Database Connection</h3>
            <p>
              Check the connection between Restaurant360 and your database.
            </p>
          </div>

          <div className="connection-status">
            <span className="status-dot"></span>
            Connected
          </div>
        </div>

        <div className="database-info-grid">

          <div className="database-info-card">
            <span>DATABASE</span>
            <strong>PostgreSQL</strong>
          </div>

          <div className="database-info-card">
            <span>SERVER</span>
            <strong>localhost</strong>
          </div>

          <div className="database-info-card">
            <span>PORT</span>
            <strong>5432</strong>
          </div>

          <div className="database-info-card">
            <span>STATUS</span>
            <strong className="connected-text">
              Online
            </strong>
          </div>

        </div>

      </div>


      <div className="settings-section">

        <div className="section-heading">

          <div>
            <h3>Data Synchronization</h3>
            <p>
              Synchronize the latest restaurant data with the database.
            </p>
          </div>

          <div className="sync-time">
            Last sync: Just now
          </div>

        </div>

        <button
          className="sync-button"
          onClick={() => alert("Data synchronization started!")}
        >
          <FiDatabase />
          Sync Now
        </button>

      </div>


      <div className="settings-section">

        <div className="section-heading">

          <div>
            <h3>Database Backup</h3>
            <p>
              Create a backup of your restaurant data.
            </p>
          </div>

        </div>

        <div className="backup-actions">

          <button
            className="secondary-action-button"
            onClick={() => alert("Database backup started!")}
          >
            <FiDatabase />
            Create Backup
          </button>

          <button
            className="secondary-action-button"
            onClick={() => alert("Restore selected!")}
          >
            Restore Backup
          </button>

        </div>

      </div>


      <div className="danger-section">

        <div>
          <h3>Reset Local Data</h3>

          <p>
            Remove locally stored application data from this device.
            This action cannot be undone.
          </p>
            </div>
            <button
          className="danger-button"
          onClick={() => {
            const confirmed = window.confirm(
              "Are you sure you want to reset local data?"
            );

            if (confirmed) {
              alert("Local data reset.");
            }
          }}
        >
          Reset Data
        </button>

      </div>

    </div>

    <div className="save-section">

      <button
        className="save-button"
        onClick={() =>
          alert("Database settings saved successfully!")
        }
      >
        <FiSave />
        Save Changes
      </button>

    </div>
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default Settings;