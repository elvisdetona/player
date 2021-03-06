// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');
var _ = require('underscore');

class Container extends UIObject {
  get name() { return 'Container' }
  get attributes() { return { 'data-container': '' } }
  get events() { return {'click': 'clicked'} }

  initialize(options) {
    this.playback = options.playback;
    this.settings = this.playback.settings;
    this.listenTo(this.playback, 'playback:progress', this.progress);
    this.listenTo(this.playback, 'playback:timeupdate', this.timeUpdated);
    this.listenTo(this.playback, 'playback:ready', this.ready);
    this.listenTo(this.playback, 'playback:buffering', this.buffering);
    this.listenTo(this.playback, 'playback:bufferfull', this.bufferfull);
    this.listenTo(this.playback, 'playback:settingsupdate', this.settingsUpdate);
    this.listenTo(this.playback, 'playback:loadedmetadata', this.loadedMetadata);
    this.listenTo(this.playback, 'playback:highdefinitionupdate', this.highDefinitionUpdate);
    this.listenTo(this.playback, 'playback:mediacontrol:disable', this.disableMediaControl);
    this.listenTo(this.playback, 'playback:mediacontrol:enable', this.enableMediaControl);
    this.listenTo(this.playback, 'playback:ended', this.ended);
    this.listenTo(this.playback, 'playback:play', this.playing);
    this.isReady = false;
    this.mediaControlDisabled = false;
    this.plugins = [this.playback];
  }

  with(klass) {
    _.extend(this, klass);
    return this;
  }

  destroy() {
    this.trigger('container:destroyed', this, this.name);
    this.playback.destroy();
    this.$el.remove();
  }

  setStyle(style) {
    this.$el.css(style);
  }

  animate(style, duration) {
    return this.$el.animate(style, duration).promise();
  }

  ready() {
    console.log('container is ready');
    this.isReady = true;
    this.trigger('container:ready', this.name);
  }

  isPlaying() {
    return this.playback.isPlaying();
  }

  error(errorObj) {
    this.trigger('container:error', errorObj, this.name);
  }

  loadedMetadata(duration) {
    this.trigger('container:loadedmetadata', duration);
  }

  timeUpdated(position, duration) {
    this.trigger('container:timeupdate', position, duration, this.name);
  }

  progress(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, duration, this.name);
  }

  playing() {
    this.trigger('container:play', this.name);
  }

  play() {
    this.playback.play();
  }

  stop() {
    this.trigger('container:stop', this.name);
    this.playback.stop();
  }

  pause() {
    this.trigger('container:pause', this.name);
    this.playback.pause();
  }

  ended() {
    this.trigger('container:ended', this, this.name);
  }

  clicked() {
    this.trigger('container:click', this, this.name);
  }

  setCurrentTime(time) {
    this.trigger('container:seek', time, this.name);
    this.playback.seek(time);
  }

  setVolume(value) {
    this.trigger('container:volume', value, this.name);
    this.playback.volume(value);
  }

  requestFullscreen() {
    this.trigger('container:fullscreen', this.name);
  }

  buffering() {
    this.trigger('container:state:buffering', this.name);
  }

  bufferfull() {
    this.trigger('container:state:bufferfull', this.name);
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);
  }

  hasPlugin(name) {
    return !!this.getPlugin(name);
  }

  getPlugin(name) {
    return _(this.plugins).find(function(plugin) { return plugin.name === name });
  }

  settingsUpdate() {
    this.settings = this.playback.settings;
    this.trigger('container:settingsupdate');
  }

  highDefinitionUpdate() {
    this.trigger('container:highdefinitionupdate');
  }

  isHighDefinitionInUse() {
    return this.playback.isHighDefinition();
  }

  disableMediaControl() {
    this.mediaControlDisabled = true;
    this.trigger('container:mediacontrol:disable');
  }

  enableMediaControl() {
    this.mediaControlDisabled = false;
    this.trigger('container:mediacontrol:enable');
  }

  render() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.$el.append(this.playback.render().el);
    return this;
  }
};

module.exports = Container;
