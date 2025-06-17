from tilat.models import Tila
from tilat.serializers import TilaSerializer
from rest_framework import viewsets

class TilaViewSet(viewsets.ModelViewSet):
    queryset = Tila.objects.all()
    serializer_class = TilaSerializer
