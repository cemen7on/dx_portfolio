<?php
class GoogleController extends CController{
    /**
     * Google user authorization
     * If success - redirects to auth URL
     */
    public function actionAuthorize(){
        Yii::app()->google->client->setApprovalPrompt('force');
        // Yii::app()->google->client->setUseObjects(true);
        Yii::app()->google->client->setScopes(array(
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtubepartner'
        ));

        $this->redirect(Yii::app()->google->client->createAuthUrl());
    }

    /**
     * Authorization redirect url.
     * Retrieves authorization credentials and saves into session
     */
    public function actionCallback(){
        if(empty($_GET['code'])){
            echo 'Authorization failed';
            exit;
        }

        Yii::app()->session->add('oauthToken', Yii::app()->google->client->authenticate($_GET['code']));

        $this->redirect('/admin/videos');
    }
} 