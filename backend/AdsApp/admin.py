from django.contrib import admin
from .models import *

class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 1  # The number of empty forms to show by default in the inline section.

class StateInline(admin.TabularInline):
    model = State
    extra = 1  # The number of empty forms to show by default in the inline section.

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')  # Columns to display in the list view
    search_fields = ['name']  # Search fields in the admin panel
    list_filter = ('created_at', 'updated_at')  # Filters on the right sidebar
    inlines = [SubcategoryInline]  # This will allow adding subcategories directly from the category admin page

class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'created_at', 'updated_at')  # Columns to display in the list view
    search_fields = ['name', 'category__name']  # Search fields
    list_filter = ('category', 'created_at', 'updated_at')  # Filters

class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')  # Columns to display in the list view
    search_fields = ['name']  # Search fields in the admin panel
    list_filter = ('created_at', 'updated_at')  # Filters on the right sidebar
    inlines = [StateInline]  # This will allow adding subcategories directly from the category admin page

class StateAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at', 'updated_at')  # Columns to display in the list view
    search_fields = ['name', 'country__name']  # Search fields
    list_filter = ('country', 'created_at', 'updated_at')  # Filters

# Register the models with the admin site
admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Country, CountryAdmin)
admin.site.register(State, StateAdmin)


