from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
   

    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'image',
            'stock',
            'in_stock',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_in_stock(self, obj):
        """Returns True if product has available stock."""
        return obj.stock > 0

    def validate_price(self, value):
        """Ensure price is never negative or zero."""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def validate_stock(self, value):
        """Ensure stock is never negative."""
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

    def validate_name(self, value):
        """Ensure name isn't just whitespace."""
        if not value.strip():
            raise serializers.ValidationError("Product name cannot be empty.")
        return value.strip()