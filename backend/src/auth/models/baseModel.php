<?php

namespace src\auth\models;

class baseModel
{
    public function set($key, $value)
    {
        $this->$key = $value;
    }

    public function get($key)
    {
        return $this->$key;
    }

    public function getObjectVars()
    {
        return get_object_vars($this);
    }

    public function getFilteredObject()
    {
        return array_filter(get_object_vars($this));
    }

    public function getKeys()
    {
        return array_keys(get_object_vars($this));
    }
}
