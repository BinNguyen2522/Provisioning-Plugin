# InvenTree Provisioning Plugin

A plugin for InvenTree to add provisioning-related data to Parts and log provisioning attempts.

## Features

* Adds `provisioning_status` (not_started, success, failed) and `imei` fields associated with each Part.
* Introduces a `ProvisioningLog` model to track provisioning attempts for StockItems.

## Installation

1.  Ensure InvenTree is installed and configured.
2.  Install this plugin:
    * Through the InvenTree Admin Interface (Plugin Settings -> Install Plugin).
    * Or using pip: `pip install inventree-provisioning-plugin` (sau khi bạn publish lên PyPI).
    * Hoặc cài đặt ở chế độ editable nếu phát triển: `pip install -e /path/to/your/provisioning_plugin`
3.  Activate the plugin in the InvenTree Admin Interface.
4.  Restart the InvenTree server.
5.  Run migrations: `invoke update` (cho Docker) hoặc `python manage.py migrate` (cho bare metal).