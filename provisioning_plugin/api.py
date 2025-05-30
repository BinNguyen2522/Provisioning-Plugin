from django.urls import path
from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from django_filters.rest_framework import DjangoFilterBackend

from .models import ProvisioningLog
from .serializers import ProvisioningLogSerializer 


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


AUTHENTICATION_CLASSES = [
    CsrfExemptSessionAuthentication,
    BasicAuthentication,
    TokenAuthentication,
]


class ProvisioningLogListCreateAPI(generics.ListCreateAPIView):
    """
    API endpoint cho phép:
    - GET: Liệt kê tất cả ProvisioningLog (có thể lọc theo stock_item, status, timestamp).
    - POST: Tạo một ProvisioningLog mới.
    """
    queryset = ProvisioningLog.objects.all().select_related(
        'stock_item',
        'stock_item__part'
    ).order_by('-timestamp')
    
    serializer_class = ProvisioningLogSerializer
    authentication_classes = AUTHENTICATION_CLASSES
    permission_classes = [permissions.IsAuthenticated]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'stock_item': ['exact'],
        'status': ['exact', 'in'],
        'timestamp': ['gte', 'lte', 'exact', 'range'],
    }


api_urls = [
    path('logs/', ProvisioningLogListCreateAPI.as_view(), name='api-provisioning-log'),
]
