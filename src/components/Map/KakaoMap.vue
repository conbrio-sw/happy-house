<template>
  <div>
    <h1>??</h1>
    <div id="map"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
    };
  },
  methods: {
    initMap() {
      var mapContainer = document.getElementById("map"); // 지도를 표시할 div
      var mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };
      // 지도를 생성합니다
      this.map = new kakao.maps.Map(mapContainer, mapOption);

      //   // 장소 검색 객체를 생성합니다
      //   this.ps = new kakao.maps.services.Places();
      //   // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
      //   this.infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      //   // 커스텀 오버레이를 생성합니다
      //   this.customOverlay;
      //   //주소-좌표 변환 객체를 생성합니다
      //   this.geocoder = new kakao.maps.services.Geocoder();
    },
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      const appkey = process.env.VUE_APP_KAKAO_MAP_API_KEY;
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
        appkey +
        "&libraries=services";
      document.head.appendChild(script);
    }
    console.log(this.sidos);
  },
};
</script>

<style scoped>
#map {
  width: 400px;
  height: 400px;
}
</style>
