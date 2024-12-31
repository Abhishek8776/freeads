from django.urls import path
from .views import * 

urlpatterns = [
    path('categories/', CategoryView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryView.as_view(), name='category-detail'),
    path('subcategories/', SubcategoryView.as_view(), name='subcategory-list-create'),
    path('subcategories/<uuid:pk>/', SubcategoryView.as_view(), name='subcategory-detail'),
    path("countries/", CountryView.as_view(), name="country-list-create"),
    path('countries/<int:pk>/', CountryView.as_view(), name='countries-detail'),
    path("states/", StateView.as_view(), name="states-list-create"),
    path('states/<uuid:pk>/', StateView.as_view(), name='states-detail'),   
    path('ads/', AdsView.as_view(), name='ads-create'),
]
