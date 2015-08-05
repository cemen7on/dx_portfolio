<?php
namespace components;

abstract class AssetsRegister extends \CApplicationComponent{
    /**
     * Registers assets, specified in map
     *
     * @param array $assets. Asset to import
     */
    public function publish($assets){
        if(is_array($assets)){
            foreach($assets as $index=>$value){
                if(is_array($value)){
                    $this->importArray($index, $value);

                    $importPath=$index;
                }
                else{
                    $importPath=$value;
                }

                $this->importPath($importPath);
            }
        }
        else{
            $this->importPath($assets);
        }
    }

    /**
     * Imports all scripts from particular directory
     *
     * @param string $dir. Directory name
     * @param array $assets. Array of assets to include from given directory
     */
    protected function importArray($dir, $assets){
        foreach($assets as $asset){
            $this->importPath($dir.DS.$asset);
        }
    }

    /**
     * Imports assets by relative path
     *
     * @param string $path. Relative asset path
     * @throws \Exception
     */
    private function importPath($path){
        $absolutePath=$this->createAbsolutePath($path);

        if(is_dir($absolutePath)){
            $this->importDir($absolutePath);
        }
        elseif(is_file($absolutePath)){
            $this->importFile($absolutePath);
        }
        else{
            throw new \CException('Failed to import asset. '.$absolutePath.' was not found');
        }
    }

    /**
     * Register all JavaScript files in directory specified by absolute path
     *
     * @param $path
     * @return $this
     * @throws \Exception
     */
    protected function importDir($path){
        if(!is_dir($path)){
            throw new \CException('Invalid argument: $path must be a directory');
        }

        $dirHandle=opendir($path);
        if(!$dirHandle){
            throw new \CException('Failed to open directory '.$path);
        }

        while(false!==($dirEntry=readdir($dirHandle))){
            if($dirEntry=='.' || $dirEntry=='..'){
                continue;
            }

            $dirEntryPath=$path.DS.$dirEntry;

            if(is_dir($dirEntryPath)){
                $this->importDir($dirEntryPath);
            }
            elseif(is_file($dirEntryPath)){
                $this->importFile($dirEntryPath);
            }
            else{
                throw new \CException('Failed to import asset. '.$dirEntryPath.' was not found');
            }
        }

        closedir($dirHandle);

        return $this;
    }

    /**
     * Register asset file by its absolute path
     *
     * @param string $path. Asset absolute path
     * @return $this
     * @throws \Exception
     */
    abstract protected function importFile($path);

    /**
     * Returns absolute path for passed entity
     *
     * @param string $entity. Entity
     * @return bool|mixed|string
     */
    protected function createAbsolutePath($entity){
        return realpath(\Yii::getPathOfAlias('webroot').DS.$entity);
    }
} 