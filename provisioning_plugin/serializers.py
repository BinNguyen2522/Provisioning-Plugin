from rest_framework import serializers
from stock.models import StockItem
from .models import ProvisioningLog, PartProvisioningData


class PartProvisioningDetailsSerializer(serializers.ModelSerializer):
    """Serializer for the PartProvisioningDetails model."""
    class Meta:
        model = PartProvisioningData
        fields = [
            'part',
            'provisioning_status',
            'imei',
            'last_updated',
        ]
        read_only_fields = ['last_updated']
        # 'part' will be a PrimaryKeyRelatedField by default.
        # If you need more part details, consider a nested serializer or
        # StringRelatedField.


class ProvisioningLogSerializer(serializers.ModelSerializer):
    """Serializer for the ProvisioningLog model."""
    stock_item = serializers.PrimaryKeyRelatedField(
        queryset=StockItem.objects.all(),
        help_text="ID of the associated StockItem."
    )
    # stock_item_display = serializers.StringRelatedField(
    #     source='stock_item', read_only=True
    # ) # Tùy chọn: để hiển thị dạng chuỗi khi GET

    class Meta:
        model = ProvisioningLog
        fields = [
            'pk',
            'stock_item',
            'status',
            'timestamp',
            'message',
        ]
        read_only_fields = ['pk', 'timestamp']

