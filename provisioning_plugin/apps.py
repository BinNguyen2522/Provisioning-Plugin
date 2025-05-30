from django.apps import AppConfig


class ProvisioningPluginConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'provisioning_plugin'  # Phải khớp với tên thư mục app
    app_label = 'provisioning_plugin'  # Label cho app, quan trọng cho migrations

    # Tên hiển thị trong Admin (tùy chọn)
    verbose_name = "Provisioning Plugin"

    # InvenTree plugin specific metadata
    plugin_name = "ProvisioningPlugin"  # Phải khớp với NAME trong ProvisioningPlugin.py
    plugin_slug = "provisioning"
    plugin_title = "Provisioning Plugin"

    # Cung cấp một hook để model được tải lên bởi InvenTree
    # Điều này quan trọng để InvenTree biết về models của bạn
    def ready(self):
        # Bạn có thể thực hiện các hành động khác ở đây khi app sẵn sàng
        import provisioning_plugin.admin