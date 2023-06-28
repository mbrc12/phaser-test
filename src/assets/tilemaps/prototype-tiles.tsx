<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.1" name="prototype-tiles" tilewidth="16" tileheight="16" tilecount="16" columns="4">
 <image source="proto-tiles.png" width="64" height="64"/>
 <tile id="0">
  <properties>
   <property name="whatever" value="Hello"/>
  </properties>
  <objectgroup draworder="index" id="2">
   <object id="1" name="collider" x="0" y="0">
    <polygon points="0,0 16,16 0,16"/>
   </object>
  </objectgroup>
 </tile>
 <tile id="1">
  <objectgroup draworder="index" id="2">
   <object id="1" name="collider" x="0" y="0">
    <polygon points="0,0 16,0 16,16 0,16"/>
   </object>
  </objectgroup>
 </tile>
</tileset>
