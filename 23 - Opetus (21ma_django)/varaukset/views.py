from .models import Varaus
from .serializers import VarausSerializer, VarausSerializerName, VarausSerializerEmbedded
from rest_framework import viewsets

class VarausViewSet(viewsets.ModelViewSet):
    queryset = Varaus.objects.all()
    serializer_class = VarausSerializer
