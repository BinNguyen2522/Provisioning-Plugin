from django.contrib import admin
from .models import PartProvisioningData, ProvisioningLog


@admin.register(PartProvisioningData)
class PartProvisioningDataAdmin(admin.ModelAdmin):
    list_display = ('part', 'provisioning_status', 'imei', 'last_updated')
    search_fields = ('part__name', 'part__IPN', 'imei')
    list_filter = ('provisioning_status',)

@admin.register(ProvisioningLog)
class ProvisioningLogAdmin(admin.ModelAdmin):
    list_display = ('stock_item', 'status', 'timestamp', 'message')
    search_fields = ('stock_item__part__name', 'stock_item__serial', 'message')
    list_filter = ('status', 'timestamp')
    readonly_fields = ('timestamp',)