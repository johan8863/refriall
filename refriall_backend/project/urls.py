"""
Top project urls
"""

# django
from django.contrib import admin
from django.urls import include, path

# rest_framework_simplejwt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('auth/', include([
            path('token/', include([
                path('', TokenObtainPairView.as_view(), name='token-obtain-pair'),
                path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
            ])),
        ])),
        path('stock/', include('stock.urls')),
        path('hr/', include('hr.urls')),
        path('finance/', include('finance.urls')),
    ])),
]
