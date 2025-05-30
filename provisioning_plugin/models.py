from django.db import models
from django.utils.translation import gettext_lazy as _

from part.models import Part
from stock.models import StockItem


class PartProvisioningData(models.Model):
    """
    Model to store provisioning status and IMEI for a Part.
    This creates a one-to-one link to the Part model.
    """
    class ProvisioningStatus(models.TextChoices):
        START = 'start', _('Start')
        SUCCESS = 'success', _('Success')
        FAILED = 'failed', _('Failed')

    part = models.OneToOneField(
        Part,
        on_delete=models.CASCADE,
        related_name='provisioning_data',  # Giúp truy cập từ Part: part_instance.provisioning_data
        primary_key=True,  # Sử dụng part_id làm khóa chính cho model này
    )

    provisioning_status = models.CharField(
        max_length=20,
        choices=ProvisioningStatus.choices,
        default=None,
        verbose_name=_('Provisioning Status'),
        help_text=_('Status of the provisioning process for this part type or template')
    )

    imei = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name=_('IMEI (template/default)'),
        help_text=_('Default or template IMEI, if applicable for this part type. Specific IMEIs for stock items should be handled differently if needed.')
    )

    # Thêm các trường metadata nếu cần
    last_updated = models.DateTimeField(auto_now=True, null=True, blank=True)

    def __str__(self):
        return f"Provisioning data for {self.part.full_name}"

    class Meta:
        app_label = "provisioning_plugin"  # Phải khớp với app_label trong apps.py
        verbose_name = _("Part Provisioning Data")
        verbose_name_plural = _("Part Provisioning Data")


class ProvisioningLog(models.Model):
    """
    Model to log provisioning attempts for a StockItem.
    """
    class LogStatus(models.TextChoices):
        START = 'start', _('Start')  # Có thể không cần nếu log chỉ tạo khi có action
        SUCCESS = 'success', _('Success')
        FAILED = 'failed', _('Failed')

    stock_item = models.ForeignKey(
        StockItem,
        on_delete=models.CASCADE,  # Hoặc models.SET_NULL nếu muốn giữ log khi StockItem bị xóa
        related_name='provisioning_logs',
        verbose_name=_('Stock Item')
    )

    status = models.CharField(
        max_length=20,
        choices=LogStatus.choices,
        default=None,
        verbose_name=_('Status')
    )

    timestamp = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Timestamp')
    )

    message = models.TextField(
        blank=True,
        verbose_name=_('Message'),
        help_text=_('Log message or error details')
    )

    # User người thực hiện provisioning (tùy chọn)
    # user = models.ForeignKey(
    #     'auth.User', on_delete=models.SET_NULL,
    #     blank=True, null=True,
    #     verbose_name=_('User')
    # )

    def __str__(self):
        return f"Log for {self.stock_item}: {self.status} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

    class Meta:
        app_label = "provisioning_plugin"  # Phải khớp với app_label trong apps.py
        verbose_name = _("Provisioning Log")
        verbose_name_plural = _("Provisioning Logs")
        ordering = ['-timestamp']