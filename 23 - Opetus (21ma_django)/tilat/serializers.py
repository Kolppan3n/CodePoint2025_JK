from tilat.models import Tila
from rest_framework import serializers

class TilaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tila
        fields = ['id', 'nimi']