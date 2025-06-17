from .models import Varaus
from tilat.models import Tila
from tilat.serializers import TilaSerializer
from varaajat.models import Varaaja
from varaajat.serializers import VaraajaSerializer
from rest_framework import serializers

class VarausSerializer(serializers.ModelSerializer):
    class Meta:
        model = Varaus
        fields = '__all__'
        
class VarausSerializerName(serializers.ModelSerializer):
    tila = serializers.SlugRelatedField(queryset=Tila.objects.all(), slug_field='nimi')
    varaaja = serializers.SlugRelatedField(queryset=Varaaja.objects.all(), slug_field='nimi')
    class Meta:
        model = Varaus
        fields = '__all__'
        
class VarausSerializerEmbedded(serializers.ModelSerializer):
    tila = TilaSerializer()
    varaaja = VaraajaSerializer()
    class Meta:
        model = Varaus
        fields = '__all__'