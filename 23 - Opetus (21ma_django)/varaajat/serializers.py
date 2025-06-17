from .models import Varaaja
from rest_framework import serializers

class VaraajaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Varaaja
        fields = ['id', 'nimi']