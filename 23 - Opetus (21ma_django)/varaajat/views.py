from .models import Varaaja
from .serializers import VaraajaSerializer
from rest_framework import viewsets

class VaraajaViewSet(viewsets.ModelViewSet):
    queryset = Varaaja.objects.all()
    serializer_class = VaraajaSerializer
