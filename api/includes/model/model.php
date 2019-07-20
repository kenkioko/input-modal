<?php namespace Api\Includes\Model;

  require_once __DIR__ . '/../connection.php';
  require_once __DIR__ .'/../reply.php';
  
  use Api\Includes\ServerReply;
  use Api\Includes\Connection;
  
  class Model
  {
      use ServerReply;
      
      protected $db_conn = null;
      
      function __construct()
      {
          $this->db_conn = new Connection;
      }
      
      public function create($data)
      {
          # code...
      }
      
      public function read()
      {
          # code...
      }
      
      public function update($data)
      {
          # code...
      }
      
      public function delete()
      {
          # code...
      }
      
      function __destruct() {
          unset($this->db_conn);
      }
  }
