from plugin import InvenTreePlugin
from plugin.mixins import AppMixin, SettingsMixin, UrlsMixin
from .version import PROVISIONING_PLUGIN_VERSION
from .api import api_urls


class ProvisioningPlugin(AppMixin, SettingsMixin, UrlsMixin, InvenTreePlugin):
    NAME = "ProvisioningPlugin"
    SLUG = "provisioning"  # Sẽ tạo ra URL dạng /plugin/provisioning/
    TITLE = "Provisioning Plugin"
    AUTHOR = "Stel"
    DESCRIPTION = "Adds provisioning status, IMEI to Parts and a provisioning log."
    VERSION = PROVISIONING_PLUGIN_VERSION
    MIN_VERSION = "0.13.0"  # Phiên bản InvenTree tối thiểu plugin này hỗ trợ

    # Không có settings cụ thể trong yêu cầu, nhưng vẫn giữ mixin nếu cần sau này
    # SETTINGS = {
    #     'SOME_SETTING': {
    #         'name': 'Some Setting',
    #         'description': 'A description for this setting',
    #         'default': True,
    #         'validator': bool,
    #     }
    # }

    def setup_urls(self):
        """
        Returns a list of URL patterns for the plugin API.
        """
        return api_urls
