//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var $ = require('jquery')

class PosterPlugin extends UIPlugin {
  get name() { return 'poster' }
  get template() { return JST.poster }

  get attributes() {
    return {
      'class': 'player-poster',
      'data-poster': ''
    }
  }

  get events() {
    return {
      'click': 'clicked'
    }
  }

  initialize(options) {
    super(options)
    if (options.disableControlsOnPoster === undefined)
      options.disableControlsOnPoster = true
    this.options = options
    if (this.options.disableControlsOnPoster)
      this.container.disableMediaControl()
    this.render()
  }

  bindEvents() {
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering)
    this.listenTo(this.container, 'container:play', this.onPlay)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:ended', this.onStop)
    this.listenTo(this.container, 'container:pip', this.onPipStateChanged)
  }

  onBuffering() {
    this.hidePlayButton()
  }

  onPlay() {
    this.$el.hide()
    if (this.options.disableControlsOnPoster) {
      this.container.enableMediaControl()
    }
  }

  onStop() {
    this.$el.show()
    if (this.options.disableControlsOnPoster) {
      this.container.disableMediaControl()
    }
    if (!this.options.hidePlayButton) {
      this.showPlayButton()
    }
  }

  onPipStateChanged(isPip) {
    this.$el.css({ fontSize: this.$el.height() })
    if (!this.options.hidePlayButton) {
      this.showPlayButton()
    }
  }

  hidePlayButton() {
    this.$playButton.hide()
  }

  showPlayButton() {
    this.$el.css({ fontSize: this.$el.height() })
    this.$playButton.show()
  }

  clicked() {
    this.container.play()
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.container.$el.append(this.el)
    this.$el.ready(() => {
      this.$el.css({ fontSize: this.options.height || this.$el.height() })
    })
    var imgEl = this.$el.find('img')[0]
    imgEl.src = this.options.poster || 'assets/default.png'
    this.$playButton = $(this.$el.find('.play-wrapper'))
    if (this.options.hidePlayButton)
      this.$playButton.hide()
    return this
  }
}

module.exports = PosterPlugin
