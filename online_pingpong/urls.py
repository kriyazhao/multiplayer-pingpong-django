from django.conf.urls import patterns, include, url
from django.views.static import * 
from django.conf import settings
from proj1.views import *

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
	 ('^exchange/$', exchange),
     ('^play/$', play),
     ('^login/$', login),
     ('^loginpage/$', loginPage)
     ('^updateOnlineMember/$', updateOnlineMember),
     ('^joinGame/$', joinGame),
     ('^requestPairPlayers/$', requestPairPlayers),
     ('^emptyPairPlayer/$', emptyPairPlayer),
     ('^startGame/$', startGame),
     ('^queryUsers/$', queryUsers),
     ('^addUsers/$', addUsers),
     ('^deleteUsers/$', deleteUsers),
     (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
     url(r'', include('django.contrib.staticfiles.urls')),
    # Examples:
    # url(r'^$', 'proj1.views.home', name='home'),
    # url(r'^proj1/', include('proj1.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
