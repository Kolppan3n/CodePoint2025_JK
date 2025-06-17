from .models import Kayttaja
from .serializers import KayttajaSerializer
from rest_framework import viewsets

class KayttajaViewSet(viewsets.ModelViewSet):
    queryset = Kayttaja.objects.all()
    serializer_class = KayttajaSerializer
