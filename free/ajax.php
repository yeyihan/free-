<?php

$datas = array(
    'datas' => '<p class="ajax_test">ajax动态数据</p>',
);
for($i = 0 ;$i<=1;$i++){
    if($i==1){
    echo json_encode($datas);    
    }    
}            
?>