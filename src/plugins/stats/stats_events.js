// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var StatsEvents = {
  statsAdd: function(metric) {
    this.trigger('container:stats:add', metric);
  },
  statsReport: function(metrics) {
    this.trigger('container:stats:report', metrics);
  }
};

module.exports = StatsEvents;
