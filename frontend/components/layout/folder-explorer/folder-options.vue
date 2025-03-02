<template>
  <div class='folder-options'>
    <font-awesome-icon :icon="['fas', 'pen']" class="folder-options__edit" title="Renomer"/>
    <font-awesome-icon :icon="['fas', 'trash-can']" class="folder-options__delete" title="Supprimer"/>
  </div>
</template>

<script setup lang='ts'>
    
</script>

<style lang='scss' scoped>
    .folder-options{
        position: absolute;
        height: 24px;
        right: -10px;
        
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 3px 5px 3px 20px;
        opacity: 0;
        background: rgb(223,223,223);
        background: -moz-linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        background: -webkit-linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        background: linear-gradient(90deg, rgba(223,223,223,0) 0%, rgba(223,223,223,1) 37%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#dfdfdf",endColorstr="#dfdfdf",GradientType=1);        transition: 0.3s;
      }
      
      &:hover {
        background-color: #dfdfdf;
      }
      
      // &:hover > .folder-explorer__folder-element__wrapper__link {
      //   text-decoration: underline 1px #000;
      // }

      &:hover > .options {
        opacity: 1;
        transform: translate(-10px);
        .edit{
          transition: 0.3s;
          &:hover {
            color: $dynamic-color;
          }
        }
        .delete {
          transition: 0.3s;
          &:hover {
            color: $danger-color;
          }
        }
      }
</style>