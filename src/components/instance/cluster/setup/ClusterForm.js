import React, { useState } from 'react';
import { Button, Row, Col, Card, CardBody } from 'reactstrap';
import { useStoreState } from 'pullstate';
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import ClusterFormInput from './ClusterFormInput';

function ClusterForm({ clusterStatus }) {

  console.log(clusterStatus);

  const [formData, setFormData] = useState({
    clusterRole: clusterStatus?.cluster_role.role,
    clusterUser: clusterStatus?.cluster_user.username,
    port: clusterStatus?.config_cluster_port,
    clusterNodeName: clusterStatus?.node_name
  });

  function formIsValid(data) {
      console.log(data);
      return `${parseInt(data.port, 10)}` === data.port &&
             parseInt(data.port, 10) >= 1024 &&
             data.clusterNodeName > 0 &&
             data.clusterRole &&
             data.clusterUser;
  }

  function updateForm(update) {
    setFormData({...formData, ...update});
  }

  async function updateClustering(update) {
      console.log('updateClustering');
  }

  return (
    <>

      <ClusterFormInput
        label="Cluster Role"
        value={formData.clusterUser} />

      <ClusterFormInput
        label="Cluster User"
        updateFn={(newClusterUser) => updateForm({ clusterUser: newClusterUser }) } 
        value={formData?.clusterUser}
        editable />

      <ClusterFormInput
        label="Cluster Port"
        updateFn={(newPort) => updateForm({ port: newPort }) }
        value={formData.port}
        editable />

      {/*
      <ClusterFormInput label="Cluster Name" update={() => {}} value={formData.clusterNodeName} editable />
      */}

      <Button
        block
        color="success"
        disabled={ !formIsValid(formData) }
        onClick={(e) => updateClustering(formData) }>
        Enable Clustering
      </Button>
    </>
  )

}

export default ClusterForm;
