import { pageTitle } from 'ember-page-title';
import QratiDemo from 'qrati-connect-ember-example/components/qrati-demo';

<template>
  {{pageTitle "Qrati Connect — Ember Example"}}

  <QratiDemo />

  {{outlet}}
</template>
