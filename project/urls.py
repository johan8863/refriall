"""
Top project urls
"""

# django
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView

# rest_framework_simplejwt
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path('api/', include([
        path('auth/', include([
            path('token/', include([
                path('', TokenObtainPairView.as_view(), name='token-obtain-pair'),
                path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
            ])),
            path('rest_framework/', include('rest_framework.urls')),
        ])),
        path('stock/', include('stock.urls')),
        path('hr/', include('hr.urls')),
        path('finance/', include('finance.urls')),
    ])),
    # any route which doesn't match api/, admin/, static/ or media/
    # will be served by the vuejs bundle
    re_path(r'^(?!api|admin|static|media).*$', TemplateView.as_view(template_name='index.html')),
]
