(function () {
  "use strict";
  const Wr = "modulepreload",
    Gr = function (i) {
      return "/" + i;
    },
    Kr = {},
    se = function (e, t, s) {
      let r = Promise.resolve();
      function n(o) {
        const a = new Event("vite:preloadError", { cancelable: !0 });
        if (((a.payload = o), window.dispatchEvent(a), !a.defaultPrevented))
          throw o;
      }
      return r.then((o) => {
        for (const a of o || []) a.status === "rejected" && n(a.reason);
        return e().catch(n);
      });
    },
    Wt = (i) => {
      let e;
      return (
        i
          ? (e = i)
          : typeof fetch > "u"
            ? (e = (...t) =>
              se(async () => {
                const { default: s } = await Promise.resolve().then(() => le);
                return { default: s };
              }, void 0).then(({ default: s }) => s(...t)))
            : (e = fetch),
        (...t) => e(...t)
      );
    };
  class De extends Error {
    constructor(e, t = "FunctionsError", s) {
      super(e), (this.name = t), (this.context = s);
    }
  }
  class Gt extends De {
    constructor(e) {
      super(
        "Failed to send a request to the Edge Function",
        "FunctionsFetchError",
        e
      );
    }
  }
  class Kt extends De {
    constructor(e) {
      super("Relay Error invoking the Edge Function", "FunctionsRelayError", e);
    }
  }
  class Vt extends De {
    constructor(e) {
      super(
        "Edge Function returned a non-2xx status code",
        "FunctionsHttpError",
        e
      );
    }
  }
  var Be;
  (function (i) {
    (i.Any = "any"),
      (i.ApNortheast1 = "ap-northeast-1"),
      (i.ApNortheast2 = "ap-northeast-2"),
      (i.ApSouth1 = "ap-south-1"),
      (i.ApSoutheast1 = "ap-southeast-1"),
      (i.ApSoutheast2 = "ap-southeast-2"),
      (i.CaCentral1 = "ca-central-1"),
      (i.EuCentral1 = "eu-central-1"),
      (i.EuWest1 = "eu-west-1"),
      (i.EuWest2 = "eu-west-2"),
      (i.EuWest3 = "eu-west-3"),
      (i.SaEast1 = "sa-east-1"),
      (i.UsEast1 = "us-east-1"),
      (i.UsWest1 = "us-west-1"),
      (i.UsWest2 = "us-west-2");
  })(Be || (Be = {}));
  var Qt = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  class Yt {
    constructor(
      e,
      { headers: t = {}, customFetch: s, region: r = Be.Any } = {}
    ) {
      (this.url = e),
        (this.headers = t),
        (this.region = r),
        (this.fetch = Wt(s));
    }
    setAuth(e) {
      this.headers.Authorization = `Bearer ${e}`;
    }
    invoke(e, t = {}) {
      var s;
      return Qt(this, void 0, void 0, function* () {
        try {
          const { headers: r, method: n, body: o } = t;
          let a = {},
            { region: c } = t;
          c || (c = this.region), c && c !== "any" && (a["x-region"] = c);
          let h;
          o &&
            ((r && !Object.prototype.hasOwnProperty.call(r, "Content-Type")) ||
              !r) &&
            ((typeof Blob < "u" && o instanceof Blob) ||
              o instanceof ArrayBuffer
              ? ((a["Content-Type"] = "application/octet-stream"), (h = o))
              : typeof o == "string"
                ? ((a["Content-Type"] = "text/plain"), (h = o))
                : typeof FormData < "u" && o instanceof FormData
                  ? (h = o)
                  : ((a["Content-Type"] = "application/json"),
                    (h = JSON.stringify(o))));
          const l = yield this.fetch(`${this.url}/${e}`, {
            method: n || "POST",
            headers: Object.assign(
              Object.assign(Object.assign({}, a), this.headers),
              r
            ),
            body: h,
          }).catch((p) => {
            throw new Gt(p);
          }),
            u = l.headers.get("x-relay-error");
          if (u && u === "true") throw new Kt(l);
          if (!l.ok) throw new Vt(l);
          let d = (
            (s = l.headers.get("Content-Type")) !== null && s !== void 0
              ? s
              : "text/plain"
          )
            .split(";")[0]
            .trim(),
            f;
          return (
            d === "application/json"
              ? (f = yield l.json())
              : d === "application/octet-stream"
                ? (f = yield l.blob())
                : d === "text/event-stream"
                  ? (f = l)
                  : d === "multipart/form-data"
                    ? (f = yield l.formData())
                    : (f = yield l.text()),
            { data: f, error: null }
          );
        } catch (r) {
          return { data: null, error: r };
        }
      });
    }
  }
  function rt(i) {
    return i &&
      i.__esModule &&
      Object.prototype.hasOwnProperty.call(i, "default")
      ? i.default
      : i;
  }
  function Xt(i) {
    if (i.__esModule) return i;
    var e = i.default;
    if (typeof e == "function") {
      var t = function s() {
        return this instanceof s
          ? Reflect.construct(e, arguments, this.constructor)
          : e.apply(this, arguments);
      };
      t.prototype = e.prototype;
    } else t = {};
    return (
      Object.defineProperty(t, "__esModule", { value: !0 }),
      Object.keys(i).forEach(function (s) {
        var r = Object.getOwnPropertyDescriptor(i, s);
        Object.defineProperty(
          t,
          s,
          r.get
            ? r
            : {
              enumerable: !0,
              get: function () {
                return i[s];
              },
            }
        );
      }),
      t
    );
  }
  var j = {},
    re = {},
    ne = {},
    ie = {},
    oe = {},
    ae = {},
    Zt = function () {
      if (typeof self < "u") return self;
      if (typeof window < "u") return window;
      if (typeof global < "u") return global;
      throw new Error("unable to locate global object");
    },
    ce = Zt();
  const es = ce.fetch,
    nt = ce.fetch.bind(ce),
    it = ce.Headers,
    ts = ce.Request,
    ss = ce.Response,
    le = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          Headers: it,
          Request: ts,
          Response: ss,
          default: nt,
          fetch: es,
        },
        Symbol.toStringTag,
        { value: "Module" }
      )
    ),
    rs = Xt(le);
  var Se = {},
    ot;
  function at() {
    if (ot) return Se;
    (ot = 1), Object.defineProperty(Se, "__esModule", { value: !0 });
    class i extends Error {
      constructor(t) {
        super(t.message),
          (this.name = "PostgrestError"),
          (this.details = t.details),
          (this.hint = t.hint),
          (this.code = t.code);
      }
    }
    return (Se.default = i), Se;
  }
  var ct;
  function lt() {
    if (ct) return ae;
    ct = 1;
    var i =
      (ae && ae.__importDefault) ||
      function (r) {
        return r && r.__esModule ? r : { default: r };
      };
    Object.defineProperty(ae, "__esModule", { value: !0 });
    const e = i(rs),
      t = i(at());
    class s {
      constructor(n) {
        (this.shouldThrowOnError = !1),
          (this.method = n.method),
          (this.url = n.url),
          (this.headers = n.headers),
          (this.schema = n.schema),
          (this.body = n.body),
          (this.shouldThrowOnError = n.shouldThrowOnError),
          (this.signal = n.signal),
          (this.isMaybeSingle = n.isMaybeSingle),
          n.fetch
            ? (this.fetch = n.fetch)
            : typeof fetch > "u"
              ? (this.fetch = e.default)
              : (this.fetch = fetch);
      }
      throwOnError() {
        return (this.shouldThrowOnError = !0), this;
      }
      setHeader(n, o) {
        return (
          (this.headers = Object.assign({}, this.headers)),
          (this.headers[n] = o),
          this
        );
      }
      then(n, o) {
        this.schema === void 0 ||
          (["GET", "HEAD"].includes(this.method)
            ? (this.headers["Accept-Profile"] = this.schema)
            : (this.headers["Content-Profile"] = this.schema)),
          this.method !== "GET" &&
          this.method !== "HEAD" &&
          (this.headers["Content-Type"] = "application/json");
        const a = this.fetch;
        let c = a(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal,
        }).then(async (h) => {
          var l, u, d;
          let f = null,
            p = null,
            k = null,
            v = h.status,
            R = h.statusText;
          if (h.ok) {
            if (this.method !== "HEAD") {
              const C = await h.text();
              C === "" ||
                (this.headers.Accept === "text/csv" ||
                  (this.headers.Accept &&
                    this.headers.Accept.includes(
                      "application/vnd.pgrst.plan+text"
                    ))
                  ? (p = C)
                  : (p = JSON.parse(C)));
            }
            const O =
              (l = this.headers.Prefer) === null || l === void 0
                ? void 0
                : l.match(/count=(exact|planned|estimated)/),
              $ =
                (u = h.headers.get("content-range")) === null || u === void 0
                  ? void 0
                  : u.split("/");
            O && $ && $.length > 1 && (k = parseInt($[1])),
              this.isMaybeSingle &&
              this.method === "GET" &&
              Array.isArray(p) &&
              (p.length > 1
                ? ((f = {
                  code: "PGRST116",
                  details: `Results contain ${p.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message:
                    "JSON object requested, multiple (or no) rows returned",
                }),
                  (p = null),
                  (k = null),
                  (v = 406),
                  (R = "Not Acceptable"))
                : p.length === 1
                  ? (p = p[0])
                  : (p = null));
          } else {
            const O = await h.text();
            try {
              (f = JSON.parse(O)),
                Array.isArray(f) &&
                h.status === 404 &&
                ((p = []), (f = null), (v = 200), (R = "OK"));
            } catch {
              h.status === 404 && O === ""
                ? ((v = 204), (R = "No Content"))
                : (f = { message: O });
            }
            if (
              (f &&
                this.isMaybeSingle &&
                !(
                  (d = f == null ? void 0 : f.details) === null || d === void 0
                ) &&
                d.includes("0 rows") &&
                ((f = null), (v = 200), (R = "OK")),
                f && this.shouldThrowOnError)
            )
              throw new t.default(f);
          }
          return { error: f, data: p, count: k, status: v, statusText: R };
        });
        return (
          this.shouldThrowOnError ||
          (c = c.catch((h) => {
            var l, u, d;
            return {
              error: {
                message: `${(l = h == null ? void 0 : h.name) !== null && l !== void 0
                    ? l
                    : "FetchError"
                  }: ${h == null ? void 0 : h.message}`,
                details: `${(u = h == null ? void 0 : h.stack) !== null && u !== void 0
                    ? u
                    : ""
                  }`,
                hint: "",
                code: `${(d = h == null ? void 0 : h.code) !== null && d !== void 0
                    ? d
                    : ""
                  }`,
              },
              data: null,
              count: null,
              status: 0,
              statusText: "",
            };
          })),
          c.then(n, o)
        );
      }
      returns() {
        return this;
      }
      overrideTypes() {
        return this;
      }
    }
    return (ae.default = s), ae;
  }
  var ht;
  function ut() {
    if (ht) return oe;
    ht = 1;
    var i =
      (oe && oe.__importDefault) ||
      function (s) {
        return s && s.__esModule ? s : { default: s };
      };
    Object.defineProperty(oe, "__esModule", { value: !0 });
    const e = i(lt());
    class t extends e.default {
      select(r) {
        let n = !1;
        const o = (r ?? "*")
          .split("")
          .map((a) => (/\s/.test(a) && !n ? "" : (a === '"' && (n = !n), a)))
          .join("");
        return (
          this.url.searchParams.set("select", o),
          this.headers.Prefer && (this.headers.Prefer += ","),
          (this.headers.Prefer += "return=representation"),
          this
        );
      }
      order(
        r,
        {
          ascending: n = !0,
          nullsFirst: o,
          foreignTable: a,
          referencedTable: c = a,
        } = {}
      ) {
        const h = c ? `${c}.order` : "order",
          l = this.url.searchParams.get(h);
        return (
          this.url.searchParams.set(
            h,
            `${l ? `${l},` : ""}${r}.${n ? "asc" : "desc"}${o === void 0 ? "" : o ? ".nullsfirst" : ".nullslast"
            }`
          ),
          this
        );
      }
      limit(r, { foreignTable: n, referencedTable: o = n } = {}) {
        const a = typeof o > "u" ? "limit" : `${o}.limit`;
        return this.url.searchParams.set(a, `${r}`), this;
      }
      range(r, n, { foreignTable: o, referencedTable: a = o } = {}) {
        const c = typeof a > "u" ? "offset" : `${a}.offset`,
          h = typeof a > "u" ? "limit" : `${a}.limit`;
        return (
          this.url.searchParams.set(c, `${r}`),
          this.url.searchParams.set(h, `${n - r + 1}`),
          this
        );
      }
      abortSignal(r) {
        return (this.signal = r), this;
      }
      single() {
        return (
          (this.headers.Accept = "application/vnd.pgrst.object+json"), this
        );
      }
      maybeSingle() {
        return (
          this.method === "GET"
            ? (this.headers.Accept = "application/json")
            : (this.headers.Accept = "application/vnd.pgrst.object+json"),
          (this.isMaybeSingle = !0),
          this
        );
      }
      csv() {
        return (this.headers.Accept = "text/csv"), this;
      }
      geojson() {
        return (this.headers.Accept = "application/geo+json"), this;
      }
      explain({
        analyze: r = !1,
        verbose: n = !1,
        settings: o = !1,
        buffers: a = !1,
        wal: c = !1,
        format: h = "text",
      } = {}) {
        var l;
        const u = [
          r ? "analyze" : null,
          n ? "verbose" : null,
          o ? "settings" : null,
          a ? "buffers" : null,
          c ? "wal" : null,
        ]
          .filter(Boolean)
          .join("|"),
          d =
            (l = this.headers.Accept) !== null && l !== void 0
              ? l
              : "application/json";
        return (
          (this.headers.Accept = `application/vnd.pgrst.plan+${h}; for="${d}"; options=${u};`),
          h === "json" ? this : this
        );
      }
      rollback() {
        var r;
        return (
          ((r = this.headers.Prefer) !== null && r !== void 0 ? r : "").trim()
            .length > 0
            ? (this.headers.Prefer += ",tx=rollback")
            : (this.headers.Prefer = "tx=rollback"),
          this
        );
      }
      returns() {
        return this;
      }
    }
    return (oe.default = t), oe;
  }
  var dt;
  function Ne() {
    if (dt) return ie;
    dt = 1;
    var i =
      (ie && ie.__importDefault) ||
      function (s) {
        return s && s.__esModule ? s : { default: s };
      };
    Object.defineProperty(ie, "__esModule", { value: !0 });
    const e = i(ut());
    class t extends e.default {
      eq(r, n) {
        return this.url.searchParams.append(r, `eq.${n}`), this;
      }
      neq(r, n) {
        return this.url.searchParams.append(r, `neq.${n}`), this;
      }
      gt(r, n) {
        return this.url.searchParams.append(r, `gt.${n}`), this;
      }
      gte(r, n) {
        return this.url.searchParams.append(r, `gte.${n}`), this;
      }
      lt(r, n) {
        return this.url.searchParams.append(r, `lt.${n}`), this;
      }
      lte(r, n) {
        return this.url.searchParams.append(r, `lte.${n}`), this;
      }
      like(r, n) {
        return this.url.searchParams.append(r, `like.${n}`), this;
      }
      likeAllOf(r, n) {
        return (
          this.url.searchParams.append(r, `like(all).{${n.join(",")}}`), this
        );
      }
      likeAnyOf(r, n) {
        return (
          this.url.searchParams.append(r, `like(any).{${n.join(",")}}`), this
        );
      }
      ilike(r, n) {
        return this.url.searchParams.append(r, `ilike.${n}`), this;
      }
      ilikeAllOf(r, n) {
        return (
          this.url.searchParams.append(r, `ilike(all).{${n.join(",")}}`), this
        );
      }
      ilikeAnyOf(r, n) {
        return (
          this.url.searchParams.append(r, `ilike(any).{${n.join(",")}}`), this
        );
      }
      is(r, n) {
        return this.url.searchParams.append(r, `is.${n}`), this;
      }
      in(r, n) {
        const o = Array.from(new Set(n))
          .map((a) =>
            typeof a == "string" && new RegExp("[,()]").test(a)
              ? `"${a}"`
              : `${a}`
          )
          .join(",");
        return this.url.searchParams.append(r, `in.(${o})`), this;
      }
      contains(r, n) {
        return (
          typeof n == "string"
            ? this.url.searchParams.append(r, `cs.${n}`)
            : Array.isArray(n)
              ? this.url.searchParams.append(r, `cs.{${n.join(",")}}`)
              : this.url.searchParams.append(r, `cs.${JSON.stringify(n)}`),
          this
        );
      }
      containedBy(r, n) {
        return (
          typeof n == "string"
            ? this.url.searchParams.append(r, `cd.${n}`)
            : Array.isArray(n)
              ? this.url.searchParams.append(r, `cd.{${n.join(",")}}`)
              : this.url.searchParams.append(r, `cd.${JSON.stringify(n)}`),
          this
        );
      }
      rangeGt(r, n) {
        return this.url.searchParams.append(r, `sr.${n}`), this;
      }
      rangeGte(r, n) {
        return this.url.searchParams.append(r, `nxl.${n}`), this;
      }
      rangeLt(r, n) {
        return this.url.searchParams.append(r, `sl.${n}`), this;
      }
      rangeLte(r, n) {
        return this.url.searchParams.append(r, `nxr.${n}`), this;
      }
      rangeAdjacent(r, n) {
        return this.url.searchParams.append(r, `adj.${n}`), this;
      }
      overlaps(r, n) {
        return (
          typeof n == "string"
            ? this.url.searchParams.append(r, `ov.${n}`)
            : this.url.searchParams.append(r, `ov.{${n.join(",")}}`),
          this
        );
      }
      textSearch(r, n, { config: o, type: a } = {}) {
        let c = "";
        a === "plain"
          ? (c = "pl")
          : a === "phrase"
            ? (c = "ph")
            : a === "websearch" && (c = "w");
        const h = o === void 0 ? "" : `(${o})`;
        return this.url.searchParams.append(r, `${c}fts${h}.${n}`), this;
      }
      match(r) {
        return (
          Object.entries(r).forEach(([n, o]) => {
            this.url.searchParams.append(n, `eq.${o}`);
          }),
          this
        );
      }
      not(r, n, o) {
        return this.url.searchParams.append(r, `not.${n}.${o}`), this;
      }
      or(r, { foreignTable: n, referencedTable: o = n } = {}) {
        const a = o ? `${o}.or` : "or";
        return this.url.searchParams.append(a, `(${r})`), this;
      }
      filter(r, n, o) {
        return this.url.searchParams.append(r, `${n}.${o}`), this;
      }
    }
    return (ie.default = t), ie;
  }
  var ft;
  function pt() {
    if (ft) return ne;
    ft = 1;
    var i =
      (ne && ne.__importDefault) ||
      function (s) {
        return s && s.__esModule ? s : { default: s };
      };
    Object.defineProperty(ne, "__esModule", { value: !0 });
    const e = i(Ne());
    class t {
      constructor(r, { headers: n = {}, schema: o, fetch: a }) {
        (this.url = r), (this.headers = n), (this.schema = o), (this.fetch = a);
      }
      select(r, { head: n = !1, count: o } = {}) {
        const a = n ? "HEAD" : "GET";
        let c = !1;
        const h = (r ?? "*")
          .split("")
          .map((l) => (/\s/.test(l) && !c ? "" : (l === '"' && (c = !c), l)))
          .join("");
        return (
          this.url.searchParams.set("select", h),
          o && (this.headers.Prefer = `count=${o}`),
          new e.default({
            method: a,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: !1,
          })
        );
      }
      insert(r, { count: n, defaultToNull: o = !0 } = {}) {
        const a = "POST",
          c = [];
        if (
          (this.headers.Prefer && c.push(this.headers.Prefer),
            n && c.push(`count=${n}`),
            o || c.push("missing=default"),
            (this.headers.Prefer = c.join(",")),
            Array.isArray(r))
        ) {
          const h = r.reduce((l, u) => l.concat(Object.keys(u)), []);
          if (h.length > 0) {
            const l = [...new Set(h)].map((u) => `"${u}"`);
            this.url.searchParams.set("columns", l.join(","));
          }
        }
        return new e.default({
          method: a,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: r,
          fetch: this.fetch,
          allowEmpty: !1,
        });
      }
      upsert(
        r,
        {
          onConflict: n,
          ignoreDuplicates: o = !1,
          count: a,
          defaultToNull: c = !0,
        } = {}
      ) {
        const h = "POST",
          l = [`resolution=${o ? "ignore" : "merge"}-duplicates`];
        if (
          (n !== void 0 && this.url.searchParams.set("on_conflict", n),
            this.headers.Prefer && l.push(this.headers.Prefer),
            a && l.push(`count=${a}`),
            c || l.push("missing=default"),
            (this.headers.Prefer = l.join(",")),
            Array.isArray(r))
        ) {
          const u = r.reduce((d, f) => d.concat(Object.keys(f)), []);
          if (u.length > 0) {
            const d = [...new Set(u)].map((f) => `"${f}"`);
            this.url.searchParams.set("columns", d.join(","));
          }
        }
        return new e.default({
          method: h,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: r,
          fetch: this.fetch,
          allowEmpty: !1,
        });
      }
      update(r, { count: n } = {}) {
        const o = "PATCH",
          a = [];
        return (
          this.headers.Prefer && a.push(this.headers.Prefer),
          n && a.push(`count=${n}`),
          (this.headers.Prefer = a.join(",")),
          new e.default({
            method: o,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: r,
            fetch: this.fetch,
            allowEmpty: !1,
          })
        );
      }
      delete({ count: r } = {}) {
        const n = "DELETE",
          o = [];
        return (
          r && o.push(`count=${r}`),
          this.headers.Prefer && o.unshift(this.headers.Prefer),
          (this.headers.Prefer = o.join(",")),
          new e.default({
            method: n,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: !1,
          })
        );
      }
    }
    return (ne.default = t), ne;
  }
  var ge = {},
    _e = {},
    gt;
  function ns() {
    return (
      gt ||
      ((gt = 1),
        Object.defineProperty(_e, "__esModule", { value: !0 }),
        (_e.version = void 0),
        (_e.version = "0.0.0-automated")),
      _e
    );
  }
  var _t;
  function is() {
    if (_t) return ge;
    (_t = 1),
      Object.defineProperty(ge, "__esModule", { value: !0 }),
      (ge.DEFAULT_HEADERS = void 0);
    const i = ns();
    return (
      (ge.DEFAULT_HEADERS = { "X-Client-Info": `postgrest-js/${i.version}` }),
      ge
    );
  }
  var vt;
  function os() {
    if (vt) return re;
    vt = 1;
    var i =
      (re && re.__importDefault) ||
      function (n) {
        return n && n.__esModule ? n : { default: n };
      };
    Object.defineProperty(re, "__esModule", { value: !0 });
    const e = i(pt()),
      t = i(Ne()),
      s = is();
    class r {
      constructor(o, { headers: a = {}, schema: c, fetch: h } = {}) {
        (this.url = o),
          (this.headers = Object.assign(
            Object.assign({}, s.DEFAULT_HEADERS),
            a
          )),
          (this.schemaName = c),
          (this.fetch = h);
      }
      from(o) {
        const a = new URL(`${this.url}/${o}`);
        return new e.default(a, {
          headers: Object.assign({}, this.headers),
          schema: this.schemaName,
          fetch: this.fetch,
        });
      }
      schema(o) {
        return new r(this.url, {
          headers: this.headers,
          schema: o,
          fetch: this.fetch,
        });
      }
      rpc(o, a = {}, { head: c = !1, get: h = !1, count: l } = {}) {
        let u;
        const d = new URL(`${this.url}/rpc/${o}`);
        let f;
        c || h
          ? ((u = c ? "HEAD" : "GET"),
            Object.entries(a)
              .filter(([k, v]) => v !== void 0)
              .map(([k, v]) => [
                k,
                Array.isArray(v) ? `{${v.join(",")}}` : `${v}`,
              ])
              .forEach(([k, v]) => {
                d.searchParams.append(k, v);
              }))
          : ((u = "POST"), (f = a));
        const p = Object.assign({}, this.headers);
        return (
          l && (p.Prefer = `count=${l}`),
          new t.default({
            method: u,
            url: d,
            headers: p,
            schema: this.schemaName,
            body: f,
            fetch: this.fetch,
            allowEmpty: !1,
          })
        );
      }
    }
    return (re.default = r), re;
  }
  var mt;
  function as() {
    if (mt) return j;
    mt = 1;
    var i =
      (j && j.__importDefault) ||
      function (a) {
        return a && a.__esModule ? a : { default: a };
      };
    Object.defineProperty(j, "__esModule", { value: !0 }),
      (j.PostgrestError =
        j.PostgrestBuilder =
        j.PostgrestTransformBuilder =
        j.PostgrestFilterBuilder =
        j.PostgrestQueryBuilder =
        j.PostgrestClient =
        void 0);
    const e = i(os());
    j.PostgrestClient = e.default;
    const t = i(pt());
    j.PostgrestQueryBuilder = t.default;
    const s = i(Ne());
    j.PostgrestFilterBuilder = s.default;
    const r = i(ut());
    j.PostgrestTransformBuilder = r.default;
    const n = i(lt());
    j.PostgrestBuilder = n.default;
    const o = i(at());
    return (
      (j.PostgrestError = o.default),
      (j.default = {
        PostgrestClient: e.default,
        PostgrestQueryBuilder: t.default,
        PostgrestFilterBuilder: s.default,
        PostgrestTransformBuilder: r.default,
        PostgrestBuilder: n.default,
        PostgrestError: o.default,
      }),
      j
    );
  }
  var cs = as();
  const ls = rt(cs),
    {
      PostgrestClient: hs,
      PostgrestQueryBuilder: Vr,
      PostgrestFilterBuilder: Qr,
      PostgrestTransformBuilder: Yr,
      PostgrestBuilder: Xr,
      PostgrestError: Zr,
    } = ls,
    us = { "X-Client-Info": "realtime-js/2.11.2" },
    ds = "1.0.0",
    yt = 1e4,
    fs = 1e3;
  var he;
  (function (i) {
    (i[(i.connecting = 0)] = "connecting"),
      (i[(i.open = 1)] = "open"),
      (i[(i.closing = 2)] = "closing"),
      (i[(i.closed = 3)] = "closed");
  })(he || (he = {}));
  var U;
  (function (i) {
    (i.closed = "closed"),
      (i.errored = "errored"),
      (i.joined = "joined"),
      (i.joining = "joining"),
      (i.leaving = "leaving");
  })(U || (U = {}));
  var N;
  (function (i) {
    (i.close = "phx_close"),
      (i.error = "phx_error"),
      (i.join = "phx_join"),
      (i.reply = "phx_reply"),
      (i.leave = "phx_leave"),
      (i.access_token = "access_token");
  })(N || (N = {}));
  var Me;
  (function (i) {
    i.websocket = "websocket";
  })(Me || (Me = {}));
  var Q;
  (function (i) {
    (i.Connecting = "connecting"),
      (i.Open = "open"),
      (i.Closing = "closing"),
      (i.Closed = "closed");
  })(Q || (Q = {}));
  class ps {
    constructor() {
      this.HEADER_LENGTH = 1;
    }
    decode(e, t) {
      return e.constructor === ArrayBuffer
        ? t(this._binaryDecode(e))
        : t(typeof e == "string" ? JSON.parse(e) : {});
    }
    _binaryDecode(e) {
      const t = new DataView(e),
        s = new TextDecoder();
      return this._decodeBroadcast(e, t, s);
    }
    _decodeBroadcast(e, t, s) {
      const r = t.getUint8(1),
        n = t.getUint8(2);
      let o = this.HEADER_LENGTH + 2;
      const a = s.decode(e.slice(o, o + r));
      o = o + r;
      const c = s.decode(e.slice(o, o + n));
      o = o + n;
      const h = JSON.parse(s.decode(e.slice(o, e.byteLength)));
      return { ref: null, topic: a, event: c, payload: h };
    }
  }
  class wt {
    constructor(e, t) {
      (this.callback = e),
        (this.timerCalc = t),
        (this.timer = void 0),
        (this.tries = 0),
        (this.callback = e),
        (this.timerCalc = t);
    }
    reset() {
      (this.tries = 0), clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer),
        (this.timer = setTimeout(() => {
          (this.tries = this.tries + 1), this.callback();
        }, this.timerCalc(this.tries + 1)));
    }
  }
  var T;
  (function (i) {
    (i.abstime = "abstime"),
      (i.bool = "bool"),
      (i.date = "date"),
      (i.daterange = "daterange"),
      (i.float4 = "float4"),
      (i.float8 = "float8"),
      (i.int2 = "int2"),
      (i.int4 = "int4"),
      (i.int4range = "int4range"),
      (i.int8 = "int8"),
      (i.int8range = "int8range"),
      (i.json = "json"),
      (i.jsonb = "jsonb"),
      (i.money = "money"),
      (i.numeric = "numeric"),
      (i.oid = "oid"),
      (i.reltime = "reltime"),
      (i.text = "text"),
      (i.time = "time"),
      (i.timestamp = "timestamp"),
      (i.timestamptz = "timestamptz"),
      (i.timetz = "timetz"),
      (i.tsrange = "tsrange"),
      (i.tstzrange = "tstzrange");
  })(T || (T = {}));
  const bt = (i, e, t = {}) => {
    var s;
    const r = (s = t.skipTypes) !== null && s !== void 0 ? s : [];
    return Object.keys(e).reduce((n, o) => ((n[o] = gs(o, i, e, r)), n), {});
  },
    gs = (i, e, t, s) => {
      const r = e.find((a) => a.name === i),
        n = r == null ? void 0 : r.type,
        o = t[i];
      return n && !s.includes(n) ? kt(n, o) : Fe(o);
    },
    kt = (i, e) => {
      if (i.charAt(0) === "_") {
        const t = i.slice(1, i.length);
        return ys(e, t);
      }
      switch (i) {
        case T.bool:
          return _s(e);
        case T.float4:
        case T.float8:
        case T.int2:
        case T.int4:
        case T.int8:
        case T.numeric:
        case T.oid:
          return vs(e);
        case T.json:
        case T.jsonb:
          return ms(e);
        case T.timestamp:
          return ws(e);
        case T.abstime:
        case T.date:
        case T.daterange:
        case T.int4range:
        case T.int8range:
        case T.money:
        case T.reltime:
        case T.text:
        case T.time:
        case T.timestamptz:
        case T.timetz:
        case T.tsrange:
        case T.tstzrange:
          return Fe(e);
        default:
          return Fe(e);
      }
    },
    Fe = (i) => i,
    _s = (i) => {
      switch (i) {
        case "t":
          return !0;
        case "f":
          return !1;
        default:
          return i;
      }
    },
    vs = (i) => {
      if (typeof i == "string") {
        const e = parseFloat(i);
        if (!Number.isNaN(e)) return e;
      }
      return i;
    },
    ms = (i) => {
      if (typeof i == "string")
        try {
          return JSON.parse(i);
        } catch (e) {
          return console.log(`JSON parse error: ${e}`), i;
        }
      return i;
    },
    ys = (i, e) => {
      if (typeof i != "string") return i;
      const t = i.length - 1,
        s = i[t];
      if (i[0] === "{" && s === "}") {
        let n;
        const o = i.slice(1, t);
        try {
          n = JSON.parse("[" + o + "]");
        } catch {
          n = o ? o.split(",") : [];
        }
        return n.map((a) => kt(e, a));
      }
      return i;
    },
    ws = (i) => (typeof i == "string" ? i.replace(" ", "T") : i),
    Et = (i) => {
      let e = i;
      return (
        (e = e.replace(/^ws/i, "http")),
        (e = e.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "")),
        e.replace(/\/+$/, "")
      );
    };
  class qe {
    constructor(e, t, s = {}, r = yt) {
      (this.channel = e),
        (this.event = t),
        (this.payload = s),
        (this.timeout = r),
        (this.sent = !1),
        (this.timeoutTimer = void 0),
        (this.ref = ""),
        (this.receivedResp = null),
        (this.recHooks = []),
        (this.refEvent = null);
    }
    resend(e) {
      (this.timeout = e),
        this._cancelRefEvent(),
        (this.ref = ""),
        (this.refEvent = null),
        (this.receivedResp = null),
        (this.sent = !1),
        this.send();
    }
    send() {
      this._hasReceived("timeout") ||
        (this.startTimeout(),
          (this.sent = !0),
          this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref,
            join_ref: this.channel._joinRef(),
          }));
    }
    updatePayload(e) {
      this.payload = Object.assign(Object.assign({}, this.payload), e);
    }
    receive(e, t) {
      var s;
      return (
        this._hasReceived(e) &&
        t(
          (s = this.receivedResp) === null || s === void 0
            ? void 0
            : s.response
        ),
        this.recHooks.push({ status: e, callback: t }),
        this
      );
    }
    startTimeout() {
      if (this.timeoutTimer) return;
      (this.ref = this.channel.socket._makeRef()),
        (this.refEvent = this.channel._replyEventName(this.ref));
      const e = (t) => {
        this._cancelRefEvent(),
          this._cancelTimeout(),
          (this.receivedResp = t),
          this._matchReceive(t);
      };
      this.channel._on(this.refEvent, {}, e),
        (this.timeoutTimer = setTimeout(() => {
          this.trigger("timeout", {});
        }, this.timeout));
    }
    trigger(e, t) {
      this.refEvent &&
        this.channel._trigger(this.refEvent, { status: e, response: t });
    }
    destroy() {
      this._cancelRefEvent(), this._cancelTimeout();
    }
    _cancelRefEvent() {
      this.refEvent && this.channel._off(this.refEvent, {});
    }
    _cancelTimeout() {
      clearTimeout(this.timeoutTimer), (this.timeoutTimer = void 0);
    }
    _matchReceive({ status: e, response: t }) {
      this.recHooks.filter((s) => s.status === e).forEach((s) => s.callback(t));
    }
    _hasReceived(e) {
      return this.receivedResp && this.receivedResp.status === e;
    }
  }
  var St;
  (function (i) {
    (i.SYNC = "sync"), (i.JOIN = "join"), (i.LEAVE = "leave");
  })(St || (St = {}));
  class ve {
    constructor(e, t) {
      (this.channel = e),
        (this.state = {}),
        (this.pendingDiffs = []),
        (this.joinRef = null),
        (this.caller = {
          onJoin: () => { },
          onLeave: () => { },
          onSync: () => { },
        });
      const s = (t == null ? void 0 : t.events) || {
        state: "presence_state",
        diff: "presence_diff",
      };
      this.channel._on(s.state, {}, (r) => {
        const { onJoin: n, onLeave: o, onSync: a } = this.caller;
        (this.joinRef = this.channel._joinRef()),
          (this.state = ve.syncState(this.state, r, n, o)),
          this.pendingDiffs.forEach((c) => {
            this.state = ve.syncDiff(this.state, c, n, o);
          }),
          (this.pendingDiffs = []),
          a();
      }),
        this.channel._on(s.diff, {}, (r) => {
          const { onJoin: n, onLeave: o, onSync: a } = this.caller;
          this.inPendingSyncState()
            ? this.pendingDiffs.push(r)
            : ((this.state = ve.syncDiff(this.state, r, n, o)), a());
        }),
        this.onJoin((r, n, o) => {
          this.channel._trigger("presence", {
            event: "join",
            key: r,
            currentPresences: n,
            newPresences: o,
          });
        }),
        this.onLeave((r, n, o) => {
          this.channel._trigger("presence", {
            event: "leave",
            key: r,
            currentPresences: n,
            leftPresences: o,
          });
        }),
        this.onSync(() => {
          this.channel._trigger("presence", { event: "sync" });
        });
    }
    static syncState(e, t, s, r) {
      const n = this.cloneDeep(e),
        o = this.transformState(t),
        a = {},
        c = {};
      return (
        this.map(n, (h, l) => {
          o[h] || (c[h] = l);
        }),
        this.map(o, (h, l) => {
          const u = n[h];
          if (u) {
            const d = l.map((v) => v.presence_ref),
              f = u.map((v) => v.presence_ref),
              p = l.filter((v) => f.indexOf(v.presence_ref) < 0),
              k = u.filter((v) => d.indexOf(v.presence_ref) < 0);
            p.length > 0 && (a[h] = p), k.length > 0 && (c[h] = k);
          } else a[h] = l;
        }),
        this.syncDiff(n, { joins: a, leaves: c }, s, r)
      );
    }
    static syncDiff(e, t, s, r) {
      const { joins: n, leaves: o } = {
        joins: this.transformState(t.joins),
        leaves: this.transformState(t.leaves),
      };
      return (
        s || (s = () => { }),
        r || (r = () => { }),
        this.map(n, (a, c) => {
          var h;
          const l = (h = e[a]) !== null && h !== void 0 ? h : [];
          if (((e[a] = this.cloneDeep(c)), l.length > 0)) {
            const u = e[a].map((f) => f.presence_ref),
              d = l.filter((f) => u.indexOf(f.presence_ref) < 0);
            e[a].unshift(...d);
          }
          s(a, l, c);
        }),
        this.map(o, (a, c) => {
          let h = e[a];
          if (!h) return;
          const l = c.map((u) => u.presence_ref);
          (h = h.filter((u) => l.indexOf(u.presence_ref) < 0)),
            (e[a] = h),
            r(a, h, c),
            h.length === 0 && delete e[a];
        }),
        e
      );
    }
    static map(e, t) {
      return Object.getOwnPropertyNames(e).map((s) => t(s, e[s]));
    }
    static transformState(e) {
      return (
        (e = this.cloneDeep(e)),
        Object.getOwnPropertyNames(e).reduce((t, s) => {
          const r = e[s];
          return (
            "metas" in r
              ? (t[s] = r.metas.map(
                (n) => (
                  (n.presence_ref = n.phx_ref),
                  delete n.phx_ref,
                  delete n.phx_ref_prev,
                  n
                )
              ))
              : (t[s] = r),
            t
          );
        }, {})
      );
    }
    static cloneDeep(e) {
      return JSON.parse(JSON.stringify(e));
    }
    onJoin(e) {
      this.caller.onJoin = e;
    }
    onLeave(e) {
      this.caller.onLeave = e;
    }
    onSync(e) {
      this.caller.onSync = e;
    }
    inPendingSyncState() {
      return !this.joinRef || this.joinRef !== this.channel._joinRef();
    }
  }
  var Tt;
  (function (i) {
    (i.ALL = "*"),
      (i.INSERT = "INSERT"),
      (i.UPDATE = "UPDATE"),
      (i.DELETE = "DELETE");
  })(Tt || (Tt = {}));
  var Ot;
  (function (i) {
    (i.BROADCAST = "broadcast"),
      (i.PRESENCE = "presence"),
      (i.POSTGRES_CHANGES = "postgres_changes"),
      (i.SYSTEM = "system");
  })(Ot || (Ot = {}));
  var q;
  (function (i) {
    (i.SUBSCRIBED = "SUBSCRIBED"),
      (i.TIMED_OUT = "TIMED_OUT"),
      (i.CLOSED = "CLOSED"),
      (i.CHANNEL_ERROR = "CHANNEL_ERROR");
  })(q || (q = {}));
  class ze {
    constructor(e, t = { config: {} }, s) {
      (this.topic = e),
        (this.params = t),
        (this.socket = s),
        (this.bindings = {}),
        (this.state = U.closed),
        (this.joinedOnce = !1),
        (this.pushBuffer = []),
        (this.subTopic = e.replace(/^realtime:/i, "")),
        (this.params.config = Object.assign(
          {
            broadcast: { ack: !1, self: !1 },
            presence: { key: "" },
            private: !1,
          },
          t.config
        )),
        (this.timeout = this.socket.timeout),
        (this.joinPush = new qe(this, N.join, this.params, this.timeout)),
        (this.rejoinTimer = new wt(
          () => this._rejoinUntilConnected(),
          this.socket.reconnectAfterMs
        )),
        this.joinPush.receive("ok", () => {
          (this.state = U.joined),
            this.rejoinTimer.reset(),
            this.pushBuffer.forEach((r) => r.send()),
            (this.pushBuffer = []);
        }),
        this._onClose(() => {
          this.rejoinTimer.reset(),
            this.socket.log(
              "channel",
              `close ${this.topic} ${this._joinRef()}`
            ),
            (this.state = U.closed),
            this.socket._remove(this);
        }),
        this._onError((r) => {
          this._isLeaving() ||
            this._isClosed() ||
            (this.socket.log("channel", `error ${this.topic}`, r),
              (this.state = U.errored),
              this.rejoinTimer.scheduleTimeout());
        }),
        this.joinPush.receive("timeout", () => {
          this._isJoining() &&
            (this.socket.log(
              "channel",
              `timeout ${this.topic}`,
              this.joinPush.timeout
            ),
              (this.state = U.errored),
              this.rejoinTimer.scheduleTimeout());
        }),
        this._on(N.reply, {}, (r, n) => {
          this._trigger(this._replyEventName(n), r);
        }),
        (this.presence = new ve(this)),
        (this.broadcastEndpointURL =
          Et(this.socket.endPoint) + "/api/broadcast"),
        (this.private = this.params.config.private || !1);
    }
    subscribe(e, t = this.timeout) {
      var s, r;
      if ((this.socket.isConnected() || this.socket.connect(), this.joinedOnce))
        throw "tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";
      {
        const {
          config: { broadcast: n, presence: o, private: a },
        } = this.params;
        this._onError((l) => (e == null ? void 0 : e(q.CHANNEL_ERROR, l))),
          this._onClose(() => (e == null ? void 0 : e(q.CLOSED)));
        const c = {},
          h = {
            broadcast: n,
            presence: o,
            postgres_changes:
              (r =
                (s = this.bindings.postgres_changes) === null || s === void 0
                  ? void 0
                  : s.map((l) => l.filter)) !== null && r !== void 0
                ? r
                : [],
            private: a,
          };
        this.socket.accessTokenValue &&
          (c.access_token = this.socket.accessTokenValue),
          this.updateJoinPayload(Object.assign({ config: h }, c)),
          (this.joinedOnce = !0),
          this._rejoin(t),
          this.joinPush
            .receive("ok", async ({ postgres_changes: l }) => {
              var u;
              if ((this.socket.setAuth(), l === void 0)) {
                e == null || e(q.SUBSCRIBED);
                return;
              } else {
                const d = this.bindings.postgres_changes,
                  f =
                    (u = d == null ? void 0 : d.length) !== null && u !== void 0
                      ? u
                      : 0,
                  p = [];
                for (let k = 0; k < f; k++) {
                  const v = d[k],
                    {
                      filter: { event: R, schema: x, table: O, filter: $ },
                    } = v,
                    C = l && l[k];
                  if (
                    C &&
                    C.event === R &&
                    C.schema === x &&
                    C.table === O &&
                    C.filter === $
                  )
                    p.push(Object.assign(Object.assign({}, v), { id: C.id }));
                  else {
                    this.unsubscribe(),
                      e == null ||
                      e(
                        q.CHANNEL_ERROR,
                        new Error(
                          "mismatch between server and client bindings for postgres changes"
                        )
                      );
                    return;
                  }
                }
                (this.bindings.postgres_changes = p), e && e(q.SUBSCRIBED);
                return;
              }
            })
            .receive("error", (l) => {
              e == null ||
                e(
                  q.CHANNEL_ERROR,
                  new Error(
                    JSON.stringify(Object.values(l).join(", ") || "error")
                  )
                );
            })
            .receive("timeout", () => {
              e == null || e(q.TIMED_OUT);
            });
      }
      return this;
    }
    presenceState() {
      return this.presence.state;
    }
    async track(e, t = {}) {
      return await this.send(
        { type: "presence", event: "track", payload: e },
        t.timeout || this.timeout
      );
    }
    async untrack(e = {}) {
      return await this.send({ type: "presence", event: "untrack" }, e);
    }
    on(e, t, s) {
      return this._on(e, t, s);
    }
    async send(e, t = {}) {
      var s, r;
      if (!this._canPush() && e.type === "broadcast") {
        const { event: n, payload: o } = e,
          c = {
            method: "POST",
            headers: {
              Authorization: this.socket.accessTokenValue
                ? `Bearer ${this.socket.accessTokenValue}`
                : "",
              apikey: this.socket.apiKey ? this.socket.apiKey : "",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                {
                  topic: this.subTopic,
                  event: n,
                  payload: o,
                  private: this.private,
                },
              ],
            }),
          };
        try {
          const h = await this._fetchWithTimeout(
            this.broadcastEndpointURL,
            c,
            (s = t.timeout) !== null && s !== void 0 ? s : this.timeout
          );
          return (
            await ((r = h.body) === null || r === void 0 ? void 0 : r.cancel()),
            h.ok ? "ok" : "error"
          );
        } catch (h) {
          return h.name === "AbortError" ? "timed out" : "error";
        }
      } else
        return new Promise((n) => {
          var o, a, c;
          const h = this._push(e.type, e, t.timeout || this.timeout);
          e.type === "broadcast" &&
            !(
              !(
                (c =
                  (a =
                    (o = this.params) === null || o === void 0
                      ? void 0
                      : o.config) === null || a === void 0
                    ? void 0
                    : a.broadcast) === null || c === void 0
              ) && c.ack
            ) &&
            n("ok"),
            h.receive("ok", () => n("ok")),
            h.receive("error", () => n("error")),
            h.receive("timeout", () => n("timed out"));
        });
    }
    updateJoinPayload(e) {
      this.joinPush.updatePayload(e);
    }
    unsubscribe(e = this.timeout) {
      this.state = U.leaving;
      const t = () => {
        this.socket.log("channel", `leave ${this.topic}`),
          this._trigger(N.close, "leave", this._joinRef());
      };
      return (
        this.rejoinTimer.reset(),
        this.joinPush.destroy(),
        new Promise((s) => {
          const r = new qe(this, N.leave, {}, e);
          r
            .receive("ok", () => {
              t(), s("ok");
            })
            .receive("timeout", () => {
              t(), s("timed out");
            })
            .receive("error", () => {
              s("error");
            }),
            r.send(),
            this._canPush() || r.trigger("ok", {});
        })
      );
    }
    async _fetchWithTimeout(e, t, s) {
      const r = new AbortController(),
        n = setTimeout(() => r.abort(), s),
        o = await this.socket.fetch(
          e,
          Object.assign(Object.assign({}, t), { signal: r.signal })
        );
      return clearTimeout(n), o;
    }
    _push(e, t, s = this.timeout) {
      if (!this.joinedOnce)
        throw `tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
      let r = new qe(this, e, t, s);
      return (
        this._canPush()
          ? r.send()
          : (r.startTimeout(), this.pushBuffer.push(r)),
        r
      );
    }
    _onMessage(e, t, s) {
      return t;
    }
    _isMember(e) {
      return this.topic === e;
    }
    _joinRef() {
      return this.joinPush.ref;
    }
    _trigger(e, t, s) {
      var r, n;
      const o = e.toLocaleLowerCase(),
        { close: a, error: c, leave: h, join: l } = N;
      if (s && [a, c, h, l].indexOf(o) >= 0 && s !== this._joinRef()) return;
      let d = this._onMessage(o, t, s);
      if (t && !d)
        throw "channel onMessage callbacks must return the payload, modified or unmodified";
      ["insert", "update", "delete"].includes(o)
        ? (r = this.bindings.postgres_changes) === null ||
        r === void 0 ||
        r
          .filter((f) => {
            var p, k, v;
            return (
              ((p = f.filter) === null || p === void 0 ? void 0 : p.event) ===
              "*" ||
              ((v =
                (k = f.filter) === null || k === void 0
                  ? void 0
                  : k.event) === null || v === void 0
                ? void 0
                : v.toLocaleLowerCase()) === o
            );
          })
          .map((f) => f.callback(d, s))
        : (n = this.bindings[o]) === null ||
        n === void 0 ||
        n
          .filter((f) => {
            var p, k, v, R, x, O;
            if (["broadcast", "presence", "postgres_changes"].includes(o))
              if ("id" in f) {
                const $ = f.id,
                  C =
                    (p = f.filter) === null || p === void 0
                      ? void 0
                      : p.event;
                return (
                  $ &&
                  ((k = t.ids) === null || k === void 0
                    ? void 0
                    : k.includes($)) &&
                  (C === "*" ||
                    (C == null ? void 0 : C.toLocaleLowerCase()) ===
                    ((v = t.data) === null || v === void 0
                      ? void 0
                      : v.type.toLocaleLowerCase()))
                );
              } else {
                const $ =
                  (x =
                    (R = f == null ? void 0 : f.filter) === null ||
                      R === void 0
                      ? void 0
                      : R.event) === null || x === void 0
                    ? void 0
                    : x.toLocaleLowerCase();
                return (
                  $ === "*" ||
                  $ ===
                  ((O = t == null ? void 0 : t.event) === null ||
                    O === void 0
                    ? void 0
                    : O.toLocaleLowerCase())
                );
              }
            else return f.type.toLocaleLowerCase() === o;
          })
          .map((f) => {
            if (typeof d == "object" && "ids" in d) {
              const p = d.data,
                {
                  schema: k,
                  table: v,
                  commit_timestamp: R,
                  type: x,
                  errors: O,
                } = p;
              d = Object.assign(
                Object.assign(
                  {},
                  {
                    schema: k,
                    table: v,
                    commit_timestamp: R,
                    eventType: x,
                    new: {},
                    old: {},
                    errors: O,
                  }
                ),
                this._getPayloadRecords(p)
              );
            }
            f.callback(d, s);
          });
    }
    _isClosed() {
      return this.state === U.closed;
    }
    _isJoined() {
      return this.state === U.joined;
    }
    _isJoining() {
      return this.state === U.joining;
    }
    _isLeaving() {
      return this.state === U.leaving;
    }
    _replyEventName(e) {
      return `chan_reply_${e}`;
    }
    _on(e, t, s) {
      const r = e.toLocaleLowerCase(),
        n = { type: r, filter: t, callback: s };
      return (
        this.bindings[r] ? this.bindings[r].push(n) : (this.bindings[r] = [n]),
        this
      );
    }
    _off(e, t) {
      const s = e.toLocaleLowerCase();
      return (
        (this.bindings[s] = this.bindings[s].filter((r) => {
          var n;
          return !(
            ((n = r.type) === null || n === void 0
              ? void 0
              : n.toLocaleLowerCase()) === s && ze.isEqual(r.filter, t)
          );
        })),
        this
      );
    }
    static isEqual(e, t) {
      if (Object.keys(e).length !== Object.keys(t).length) return !1;
      for (const s in e) if (e[s] !== t[s]) return !1;
      return !0;
    }
    _rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout(),
        this.socket.isConnected() && this._rejoin();
    }
    _onClose(e) {
      this._on(N.close, {}, e);
    }
    _onError(e) {
      this._on(N.error, {}, (t) => e(t));
    }
    _canPush() {
      return this.socket.isConnected() && this._isJoined();
    }
    _rejoin(e = this.timeout) {
      this._isLeaving() ||
        (this.socket._leaveOpenTopic(this.topic),
          (this.state = U.joining),
          this.joinPush.resend(e));
    }
    _getPayloadRecords(e) {
      const t = { new: {}, old: {} };
      return (
        (e.type === "INSERT" || e.type === "UPDATE") &&
        (t.new = bt(e.columns, e.record)),
        (e.type === "UPDATE" || e.type === "DELETE") &&
        (t.old = bt(e.columns, e.old_record)),
        t
      );
    }
  }
  const bs = () => { },
    ks = typeof WebSocket < "u",
    Es = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
  class Ss {
    constructor(e, t) {
      var s;
      (this.accessTokenValue = null),
        (this.apiKey = null),
        (this.channels = []),
        (this.endPoint = ""),
        (this.httpEndpoint = ""),
        (this.headers = us),
        (this.params = {}),
        (this.timeout = yt),
        (this.heartbeatIntervalMs = 3e4),
        (this.heartbeatTimer = void 0),
        (this.pendingHeartbeatRef = null),
        (this.ref = 0),
        (this.logger = bs),
        (this.conn = null),
        (this.sendBuffer = []),
        (this.serializer = new ps()),
        (this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: [],
        }),
        (this.accessToken = null),
        (this._resolveFetch = (n) => {
          let o;
          return (
            n
              ? (o = n)
              : typeof fetch > "u"
                ? (o = (...a) =>
                  se(async () => {
                    const { default: c } = await Promise.resolve().then(
                      () => le
                    );
                    return { default: c };
                  }, void 0).then(({ default: c }) => c(...a)))
                : (o = fetch),
            (...a) => o(...a)
          );
        }),
        (this.endPoint = `${e}/${Me.websocket}`),
        (this.httpEndpoint = Et(e)),
        t != null && t.transport
          ? (this.transport = t.transport)
          : (this.transport = null),
        t != null && t.params && (this.params = t.params),
        t != null &&
        t.headers &&
        (this.headers = Object.assign(
          Object.assign({}, this.headers),
          t.headers
        )),
        t != null && t.timeout && (this.timeout = t.timeout),
        t != null && t.logger && (this.logger = t.logger),
        t != null &&
        t.heartbeatIntervalMs &&
        (this.heartbeatIntervalMs = t.heartbeatIntervalMs);
      const r =
        (s = t == null ? void 0 : t.params) === null || s === void 0
          ? void 0
          : s.apikey;
      if (
        (r && ((this.accessTokenValue = r), (this.apiKey = r)),
          (this.reconnectAfterMs =
            t != null && t.reconnectAfterMs
              ? t.reconnectAfterMs
              : (n) => [1e3, 2e3, 5e3, 1e4][n - 1] || 1e4),
          (this.encode =
            t != null && t.encode ? t.encode : (n, o) => o(JSON.stringify(n))),
          (this.decode =
            t != null && t.decode
              ? t.decode
              : this.serializer.decode.bind(this.serializer)),
          (this.reconnectTimer = new wt(async () => {
            this.disconnect(), this.connect();
          }, this.reconnectAfterMs)),
          (this.fetch = this._resolveFetch(t == null ? void 0 : t.fetch)),
          t != null && t.worker)
      ) {
        if (typeof window < "u" && !window.Worker)
          throw new Error("Web Worker is not supported");
        (this.worker = (t == null ? void 0 : t.worker) || !1),
          (this.workerUrl = t == null ? void 0 : t.workerUrl);
      }
      this.accessToken = (t == null ? void 0 : t.accessToken) || null;
    }
    connect() {
      if (!this.conn) {
        if (this.transport) {
          this.conn = new this.transport(this.endpointURL(), void 0, {
            headers: this.headers,
          });
          return;
        }
        if (ks) {
          (this.conn = new WebSocket(this.endpointURL())),
            this.setupConnection();
          return;
        }
        (this.conn = new Ts(this.endpointURL(), void 0, {
          close: () => {
            this.conn = null;
          },
        })),
          se(async () => {
            const { default: e } = await Promise.resolve().then(() => Fr);
            return { default: e };
          }, void 0).then(({ default: e }) => {
            (this.conn = new e(this.endpointURL(), void 0, {
              headers: this.headers,
            })),
              this.setupConnection();
          });
      }
    }
    endpointURL() {
      return this._appendParams(
        this.endPoint,
        Object.assign({}, this.params, { vsn: ds })
      );
    }
    disconnect(e, t) {
      this.conn &&
        ((this.conn.onclose = function () { }),
          e ? this.conn.close(e, t ?? "") : this.conn.close(),
          (this.conn = null),
          this.heartbeatTimer && clearInterval(this.heartbeatTimer),
          this.reconnectTimer.reset());
    }
    getChannels() {
      return this.channels;
    }
    async removeChannel(e) {
      const t = await e.unsubscribe();
      return this.channels.length === 0 && this.disconnect(), t;
    }
    async removeAllChannels() {
      const e = await Promise.all(this.channels.map((t) => t.unsubscribe()));
      return this.disconnect(), e;
    }
    log(e, t, s) {
      this.logger(e, t, s);
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case he.connecting:
          return Q.Connecting;
        case he.open:
          return Q.Open;
        case he.closing:
          return Q.Closing;
        default:
          return Q.Closed;
      }
    }
    isConnected() {
      return this.connectionState() === Q.Open;
    }
    channel(e, t = { config: {} }) {
      const s = new ze(`realtime:${e}`, t, this);
      return this.channels.push(s), s;
    }
    push(e) {
      const { topic: t, event: s, payload: r, ref: n } = e,
        o = () => {
          this.encode(e, (a) => {
            var c;
            (c = this.conn) === null || c === void 0 || c.send(a);
          });
        };
      this.log("push", `${t} ${s} (${n})`, r),
        this.isConnected() ? o() : this.sendBuffer.push(o);
    }
    async setAuth(e = null) {
      let t =
        e ||
        (this.accessToken && (await this.accessToken())) ||
        this.accessTokenValue;
      if (t) {
        let s = null;
        try {
          s = JSON.parse(atob(t.split(".")[1]));
        } catch { }
        if (s && s.exp && !(Math.floor(Date.now() / 1e3) - s.exp < 0))
          return (
            this.log(
              "auth",
              `InvalidJWTToken: Invalid value for JWT claim "exp" with value ${s.exp}`
            ),
            Promise.reject(
              `InvalidJWTToken: Invalid value for JWT claim "exp" with value ${s.exp}`
            )
          );
        (this.accessTokenValue = t),
          this.channels.forEach((r) => {
            t && r.updateJoinPayload({ access_token: t }),
              r.joinedOnce &&
              r._isJoined() &&
              r._push(N.access_token, { access_token: t });
          });
      }
    }
    async sendHeartbeat() {
      var e;
      if (this.isConnected()) {
        if (this.pendingHeartbeatRef) {
          (this.pendingHeartbeatRef = null),
            this.log(
              "transport",
              "heartbeat timeout. Attempting to re-establish connection"
            ),
            (e = this.conn) === null ||
            e === void 0 ||
            e.close(fs, "hearbeat timeout");
          return;
        }
        (this.pendingHeartbeatRef = this._makeRef()),
          this.push({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: this.pendingHeartbeatRef,
          }),
          this.setAuth();
      }
    }
    flushSendBuffer() {
      this.isConnected() &&
        this.sendBuffer.length > 0 &&
        (this.sendBuffer.forEach((e) => e()), (this.sendBuffer = []));
    }
    _makeRef() {
      let e = this.ref + 1;
      return (
        e === this.ref ? (this.ref = 0) : (this.ref = e), this.ref.toString()
      );
    }
    _leaveOpenTopic(e) {
      let t = this.channels.find(
        (s) => s.topic === e && (s._isJoined() || s._isJoining())
      );
      t &&
        (this.log("transport", `leaving duplicate topic "${e}"`),
          t.unsubscribe());
    }
    _remove(e) {
      this.channels = this.channels.filter(
        (t) => t._joinRef() !== e._joinRef()
      );
    }
    setupConnection() {
      this.conn &&
        ((this.conn.binaryType = "arraybuffer"),
          (this.conn.onopen = () => this._onConnOpen()),
          (this.conn.onerror = (e) => this._onConnError(e)),
          (this.conn.onmessage = (e) => this._onConnMessage(e)),
          (this.conn.onclose = (e) => this._onConnClose(e)));
    }
    _onConnMessage(e) {
      this.decode(e.data, (t) => {
        let { topic: s, event: r, payload: n, ref: o } = t;
        o &&
          o === this.pendingHeartbeatRef &&
          (this.pendingHeartbeatRef = null),
          this.log(
            "receive",
            `${n.status || ""} ${s} ${r} ${(o && "(" + o + ")") || ""}`,
            n
          ),
          this.channels
            .filter((a) => a._isMember(s))
            .forEach((a) => a._trigger(r, n, o)),
          this.stateChangeCallbacks.message.forEach((a) => a(t));
      });
    }
    async _onConnOpen() {
      if (
        (this.log("transport", `connected to ${this.endpointURL()}`),
          this.flushSendBuffer(),
          this.reconnectTimer.reset(),
          !this.worker)
      )
        this.heartbeatTimer && clearInterval(this.heartbeatTimer),
          (this.heartbeatTimer = setInterval(
            () => this.sendHeartbeat(),
            this.heartbeatIntervalMs
          ));
      else {
        this.workerUrl
          ? this.log("worker", `starting worker for from ${this.workerUrl}`)
          : this.log("worker", "starting default worker");
        const e = this._workerObjectUrl(this.workerUrl);
        (this.workerRef = new Worker(e)),
          (this.workerRef.onerror = (t) => {
            this.log("worker", "worker error", t.message),
              this.workerRef.terminate();
          }),
          (this.workerRef.onmessage = (t) => {
            t.data.event === "keepAlive" && this.sendHeartbeat();
          }),
          this.workerRef.postMessage({
            event: "start",
            interval: this.heartbeatIntervalMs,
          });
      }
      this.stateChangeCallbacks.open.forEach((e) => e());
    }
    _onConnClose(e) {
      this.log("transport", "close", e),
        this._triggerChanError(),
        this.heartbeatTimer && clearInterval(this.heartbeatTimer),
        this.reconnectTimer.scheduleTimeout(),
        this.stateChangeCallbacks.close.forEach((t) => t(e));
    }
    _onConnError(e) {
      this.log("transport", e.message),
        this._triggerChanError(),
        this.stateChangeCallbacks.error.forEach((t) => t(e));
    }
    _triggerChanError() {
      this.channels.forEach((e) => e._trigger(N.error));
    }
    _appendParams(e, t) {
      if (Object.keys(t).length === 0) return e;
      const s = e.match(/\?/) ? "&" : "?",
        r = new URLSearchParams(t);
      return `${e}${s}${r}`;
    }
    _workerObjectUrl(e) {
      let t;
      if (e) t = e;
      else {
        const s = new Blob([Es], { type: "application/javascript" });
        t = URL.createObjectURL(s);
      }
      return t;
    }
  }
  class Ts {
    constructor(e, t, s) {
      (this.binaryType = "arraybuffer"),
        (this.onclose = () => { }),
        (this.onerror = () => { }),
        (this.onmessage = () => { }),
        (this.onopen = () => { }),
        (this.readyState = he.connecting),
        (this.send = () => { }),
        (this.url = null),
        (this.url = e),
        (this.close = s.close);
    }
  }
  class Je extends Error {
    constructor(e) {
      super(e), (this.__isStorageError = !0), (this.name = "StorageError");
    }
  }
  function A(i) {
    return typeof i == "object" && i !== null && "__isStorageError" in i;
  }
  class Os extends Je {
    constructor(e, t) {
      super(e), (this.name = "StorageApiError"), (this.status = t);
    }
    toJSON() {
      return { name: this.name, message: this.message, status: this.status };
    }
  }
  class He extends Je {
    constructor(e, t) {
      super(e), (this.name = "StorageUnknownError"), (this.originalError = t);
    }
  }
  var Ps = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  const Pt = (i) => {
    let e;
    return (
      i
        ? (e = i)
        : typeof fetch > "u"
          ? (e = (...t) =>
            se(async () => {
              const { default: s } = await Promise.resolve().then(() => le);
              return { default: s };
            }, void 0).then(({ default: s }) => s(...t)))
          : (e = fetch),
      (...t) => e(...t)
    );
  },
    $s = () =>
      Ps(void 0, void 0, void 0, function* () {
        return typeof Response > "u"
          ? (yield se(() => Promise.resolve().then(() => le), void 0)).Response
          : Response;
      }),
    We = (i) => {
      if (Array.isArray(i)) return i.map((t) => We(t));
      if (typeof i == "function" || i !== Object(i)) return i;
      const e = {};
      return (
        Object.entries(i).forEach(([t, s]) => {
          const r = t.replace(/([-_][a-z])/gi, (n) =>
            n.toUpperCase().replace(/[-_]/g, "")
          );
          e[r] = We(s);
        }),
        e
      );
    };
  var Y = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  const Ge = (i) =>
    i.msg || i.message || i.error_description || i.error || JSON.stringify(i),
    js = (i, e, t) =>
      Y(void 0, void 0, void 0, function* () {
        const s = yield $s();
        i instanceof s && !(t != null && t.noResolveJson)
          ? i
            .json()
            .then((r) => {
              e(new Os(Ge(r), i.status || 500));
            })
            .catch((r) => {
              e(new He(Ge(r), r));
            })
          : e(new He(Ge(i), i));
      }),
    As = (i, e, t, s) => {
      const r = { method: i, headers: (e == null ? void 0 : e.headers) || {} };
      return i === "GET"
        ? r
        : ((r.headers = Object.assign(
          { "Content-Type": "application/json" },
          e == null ? void 0 : e.headers
        )),
          s && (r.body = JSON.stringify(s)),
          Object.assign(Object.assign({}, r), t));
    };
  function me(i, e, t, s, r, n) {
    return Y(this, void 0, void 0, function* () {
      return new Promise((o, a) => {
        i(t, As(e, s, r, n))
          .then((c) => {
            if (!c.ok) throw c;
            return s != null && s.noResolveJson ? c : c.json();
          })
          .then((c) => o(c))
          .catch((c) => js(c, a, s));
      });
    });
  }
  function Te(i, e, t, s) {
    return Y(this, void 0, void 0, function* () {
      return me(i, "GET", e, t, s);
    });
  }
  function z(i, e, t, s, r) {
    return Y(this, void 0, void 0, function* () {
      return me(i, "POST", e, s, r, t);
    });
  }
  function Cs(i, e, t, s, r) {
    return Y(this, void 0, void 0, function* () {
      return me(i, "PUT", e, s, r, t);
    });
  }
  function Rs(i, e, t, s) {
    return Y(this, void 0, void 0, function* () {
      return me(
        i,
        "HEAD",
        e,
        Object.assign(Object.assign({}, t), { noResolveJson: !0 }),
        s
      );
    });
  }
  function $t(i, e, t, s, r) {
    return Y(this, void 0, void 0, function* () {
      return me(i, "DELETE", e, s, r, t);
    });
  }
  var L = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  const xs = {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  },
    jt = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: !1,
    };
  class Is {
    constructor(e, t = {}, s, r) {
      (this.url = e),
        (this.headers = t),
        (this.bucketId = s),
        (this.fetch = Pt(r));
    }
    uploadOrUpdate(e, t, s, r) {
      return L(this, void 0, void 0, function* () {
        try {
          let n;
          const o = Object.assign(Object.assign({}, jt), r);
          let a = Object.assign(
            Object.assign({}, this.headers),
            e === "POST" && { "x-upsert": String(o.upsert) }
          );
          const c = o.metadata;
          typeof Blob < "u" && s instanceof Blob
            ? ((n = new FormData()),
              n.append("cacheControl", o.cacheControl),
              c && n.append("metadata", this.encodeMetadata(c)),
              n.append("", s))
            : typeof FormData < "u" && s instanceof FormData
              ? ((n = s),
                n.append("cacheControl", o.cacheControl),
                c && n.append("metadata", this.encodeMetadata(c)))
              : ((n = s),
                (a["cache-control"] = `max-age=${o.cacheControl}`),
                (a["content-type"] = o.contentType),
                c && (a["x-metadata"] = this.toBase64(this.encodeMetadata(c)))),
            r != null &&
            r.headers &&
            (a = Object.assign(Object.assign({}, a), r.headers));
          const h = this._removeEmptyFolders(t),
            l = this._getFinalPath(h),
            u = yield this.fetch(
              `${this.url}/object/${l}`,
              Object.assign(
                { method: e, body: n, headers: a },
                o != null && o.duplex ? { duplex: o.duplex } : {}
              )
            ),
            d = yield u.json();
          return u.ok
            ? { data: { path: h, id: d.Id, fullPath: d.Key }, error: null }
            : { data: null, error: d };
        } catch (n) {
          if (A(n)) return { data: null, error: n };
          throw n;
        }
      });
    }
    upload(e, t, s) {
      return L(this, void 0, void 0, function* () {
        return this.uploadOrUpdate("POST", e, t, s);
      });
    }
    uploadToSignedUrl(e, t, s, r) {
      return L(this, void 0, void 0, function* () {
        const n = this._removeEmptyFolders(e),
          o = this._getFinalPath(n),
          a = new URL(this.url + `/object/upload/sign/${o}`);
        a.searchParams.set("token", t);
        try {
          let c;
          const h = Object.assign({ upsert: jt.upsert }, r),
            l = Object.assign(Object.assign({}, this.headers), {
              "x-upsert": String(h.upsert),
            });
          typeof Blob < "u" && s instanceof Blob
            ? ((c = new FormData()),
              c.append("cacheControl", h.cacheControl),
              c.append("", s))
            : typeof FormData < "u" && s instanceof FormData
              ? ((c = s), c.append("cacheControl", h.cacheControl))
              : ((c = s),
                (l["cache-control"] = `max-age=${h.cacheControl}`),
                (l["content-type"] = h.contentType));
          const u = yield this.fetch(a.toString(), {
            method: "PUT",
            body: c,
            headers: l,
          }),
            d = yield u.json();
          return u.ok
            ? { data: { path: n, fullPath: d.Key }, error: null }
            : { data: null, error: d };
        } catch (c) {
          if (A(c)) return { data: null, error: c };
          throw c;
        }
      });
    }
    createSignedUploadUrl(e, t) {
      return L(this, void 0, void 0, function* () {
        try {
          let s = this._getFinalPath(e);
          const r = Object.assign({}, this.headers);
          t != null && t.upsert && (r["x-upsert"] = "true");
          const n = yield z(
            this.fetch,
            `${this.url}/object/upload/sign/${s}`,
            {},
            { headers: r }
          ),
            o = new URL(this.url + n.url),
            a = o.searchParams.get("token");
          if (!a) throw new Je("No token returned by API");
          return {
            data: { signedUrl: o.toString(), path: e, token: a },
            error: null,
          };
        } catch (s) {
          if (A(s)) return { data: null, error: s };
          throw s;
        }
      });
    }
    update(e, t, s) {
      return L(this, void 0, void 0, function* () {
        return this.uploadOrUpdate("PUT", e, t, s);
      });
    }
    move(e, t, s) {
      return L(this, void 0, void 0, function* () {
        try {
          return {
            data: yield z(
              this.fetch,
              `${this.url}/object/move`,
              {
                bucketId: this.bucketId,
                sourceKey: e,
                destinationKey: t,
                destinationBucket: s == null ? void 0 : s.destinationBucket,
              },
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (r) {
          if (A(r)) return { data: null, error: r };
          throw r;
        }
      });
    }
    copy(e, t, s) {
      return L(this, void 0, void 0, function* () {
        try {
          return {
            data: {
              path: (yield z(
                this.fetch,
                `${this.url}/object/copy`,
                {
                  bucketId: this.bucketId,
                  sourceKey: e,
                  destinationKey: t,
                  destinationBucket: s == null ? void 0 : s.destinationBucket,
                },
                { headers: this.headers }
              )).Key,
            },
            error: null,
          };
        } catch (r) {
          if (A(r)) return { data: null, error: r };
          throw r;
        }
      });
    }
    createSignedUrl(e, t, s) {
      return L(this, void 0, void 0, function* () {
        try {
          let r = this._getFinalPath(e),
            n = yield z(
              this.fetch,
              `${this.url}/object/sign/${r}`,
              Object.assign(
                { expiresIn: t },
                s != null && s.transform ? { transform: s.transform } : {}
              ),
              { headers: this.headers }
            );
          const o =
            s != null && s.download
              ? `&download=${s.download === !0 ? "" : s.download}`
              : "";
          return (
            (n = { signedUrl: encodeURI(`${this.url}${n.signedURL}${o}`) }),
            { data: n, error: null }
          );
        } catch (r) {
          if (A(r)) return { data: null, error: r };
          throw r;
        }
      });
    }
    createSignedUrls(e, t, s) {
      return L(this, void 0, void 0, function* () {
        try {
          const r = yield z(
            this.fetch,
            `${this.url}/object/sign/${this.bucketId}`,
            { expiresIn: t, paths: e },
            { headers: this.headers }
          ),
            n =
              s != null && s.download
                ? `&download=${s.download === !0 ? "" : s.download}`
                : "";
          return {
            data: r.map((o) =>
              Object.assign(Object.assign({}, o), {
                signedUrl: o.signedURL
                  ? encodeURI(`${this.url}${o.signedURL}${n}`)
                  : null,
              })
            ),
            error: null,
          };
        } catch (r) {
          if (A(r)) return { data: null, error: r };
          throw r;
        }
      });
    }
    download(e, t) {
      return L(this, void 0, void 0, function* () {
        const r =
          typeof (t == null ? void 0 : t.transform) < "u"
            ? "render/image/authenticated"
            : "object",
          n = this.transformOptsToQueryString(
            (t == null ? void 0 : t.transform) || {}
          ),
          o = n ? `?${n}` : "";
        try {
          const a = this._getFinalPath(e);
          return {
            data: yield (yield Te(this.fetch, `${this.url}/${r}/${a}${o}`, {
              headers: this.headers,
              noResolveJson: !0,
            })).blob(),
            error: null,
          };
        } catch (a) {
          if (A(a)) return { data: null, error: a };
          throw a;
        }
      });
    }
    info(e) {
      return L(this, void 0, void 0, function* () {
        const t = this._getFinalPath(e);
        try {
          const s = yield Te(this.fetch, `${this.url}/object/info/${t}`, {
            headers: this.headers,
          });
          return { data: We(s), error: null };
        } catch (s) {
          if (A(s)) return { data: null, error: s };
          throw s;
        }
      });
    }
    exists(e) {
      return L(this, void 0, void 0, function* () {
        const t = this._getFinalPath(e);
        try {
          return (
            yield Rs(this.fetch, `${this.url}/object/${t}`, {
              headers: this.headers,
            }),
            { data: !0, error: null }
          );
        } catch (s) {
          if (A(s) && s instanceof He) {
            const r = s.originalError;
            if ([400, 404].includes(r == null ? void 0 : r.status))
              return { data: !1, error: s };
          }
          throw s;
        }
      });
    }
    getPublicUrl(e, t) {
      const s = this._getFinalPath(e),
        r = [],
        n =
          t != null && t.download
            ? `download=${t.download === !0 ? "" : t.download}`
            : "";
      n !== "" && r.push(n);
      const a =
        typeof (t == null ? void 0 : t.transform) < "u"
          ? "render/image"
          : "object",
        c = this.transformOptsToQueryString(
          (t == null ? void 0 : t.transform) || {}
        );
      c !== "" && r.push(c);
      let h = r.join("&");
      return (
        h !== "" && (h = `?${h}`),
        { data: { publicUrl: encodeURI(`${this.url}/${a}/public/${s}${h}`) } }
      );
    }
    remove(e) {
      return L(this, void 0, void 0, function* () {
        try {
          return {
            data: yield $t(
              this.fetch,
              `${this.url}/object/${this.bucketId}`,
              { prefixes: e },
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (t) {
          if (A(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
    list(e, t, s) {
      return L(this, void 0, void 0, function* () {
        try {
          const r = Object.assign(Object.assign(Object.assign({}, xs), t), {
            prefix: e || "",
          });
          return {
            data: yield z(
              this.fetch,
              `${this.url}/object/list/${this.bucketId}`,
              r,
              { headers: this.headers },
              s
            ),
            error: null,
          };
        } catch (r) {
          if (A(r)) return { data: null, error: r };
          throw r;
        }
      });
    }
    encodeMetadata(e) {
      return JSON.stringify(e);
    }
    toBase64(e) {
      return typeof Buffer < "u" ? Buffer.from(e).toString("base64") : btoa(e);
    }
    _getFinalPath(e) {
      return `${this.bucketId}/${e}`;
    }
    _removeEmptyFolders(e) {
      return e.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
    }
    transformOptsToQueryString(e) {
      const t = [];
      return (
        e.width && t.push(`width=${e.width}`),
        e.height && t.push(`height=${e.height}`),
        e.resize && t.push(`resize=${e.resize}`),
        e.format && t.push(`format=${e.format}`),
        e.quality && t.push(`quality=${e.quality}`),
        t.join("&")
      );
    }
  }
  const Ls = { "X-Client-Info": "storage-js/2.7.1" };
  var ue = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  class Us {
    constructor(e, t = {}, s) {
      (this.url = e),
        (this.headers = Object.assign(Object.assign({}, Ls), t)),
        (this.fetch = Pt(s));
    }
    listBuckets() {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield Te(this.fetch, `${this.url}/bucket`, {
              headers: this.headers,
            }),
            error: null,
          };
        } catch (e) {
          if (A(e)) return { data: null, error: e };
          throw e;
        }
      });
    }
    getBucket(e) {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield Te(this.fetch, `${this.url}/bucket/${e}`, {
              headers: this.headers,
            }),
            error: null,
          };
        } catch (t) {
          if (A(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
    createBucket(e, t = { public: !1 }) {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield z(
              this.fetch,
              `${this.url}/bucket`,
              {
                id: e,
                name: e,
                public: t.public,
                file_size_limit: t.fileSizeLimit,
                allowed_mime_types: t.allowedMimeTypes,
              },
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (s) {
          if (A(s)) return { data: null, error: s };
          throw s;
        }
      });
    }
    updateBucket(e, t) {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield Cs(
              this.fetch,
              `${this.url}/bucket/${e}`,
              {
                id: e,
                name: e,
                public: t.public,
                file_size_limit: t.fileSizeLimit,
                allowed_mime_types: t.allowedMimeTypes,
              },
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (s) {
          if (A(s)) return { data: null, error: s };
          throw s;
        }
      });
    }
    emptyBucket(e) {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield z(
              this.fetch,
              `${this.url}/bucket/${e}/empty`,
              {},
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (t) {
          if (A(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
    deleteBucket(e) {
      return ue(this, void 0, void 0, function* () {
        try {
          return {
            data: yield $t(
              this.fetch,
              `${this.url}/bucket/${e}`,
              {},
              { headers: this.headers }
            ),
            error: null,
          };
        } catch (t) {
          if (A(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
  }
  class Ds extends Us {
    constructor(e, t = {}, s) {
      super(e, t, s);
    }
    from(e) {
      return new Is(this.url, this.headers, e, this.fetch);
    }
  }
  const Bs = "2.49.1";
  let ye = "";
  typeof Deno < "u"
    ? (ye = "deno")
    : typeof document < "u"
      ? (ye = "web")
      : typeof navigator < "u" && navigator.product === "ReactNative"
        ? (ye = "react-native")
        : (ye = "node");
  const Ns = { headers: { "X-Client-Info": `supabase-js-${ye}/${Bs}` } },
    Ms = { schema: "public" },
    Fs = {
      autoRefreshToken: !0,
      persistSession: !0,
      detectSessionInUrl: !0,
      flowType: "implicit",
    },
    qs = {};
  var zs = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  const Js = (i) => {
    let e;
    return (
      i ? (e = i) : typeof fetch > "u" ? (e = nt) : (e = fetch),
      (...t) => e(...t)
    );
  },
    Hs = () => (typeof Headers > "u" ? it : Headers),
    Ws = (i, e, t) => {
      const s = Js(t),
        r = Hs();
      return (n, o) =>
        zs(void 0, void 0, void 0, function* () {
          var a;
          const c = (a = yield e()) !== null && a !== void 0 ? a : i;
          let h = new r(o == null ? void 0 : o.headers);
          return (
            h.has("apikey") || h.set("apikey", i),
            h.has("Authorization") || h.set("Authorization", `Bearer ${c}`),
            s(n, Object.assign(Object.assign({}, o), { headers: h }))
          );
        });
    };
  var Gs = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  function Ks(i) {
    return i.replace(/\/$/, "");
  }
  function Vs(i, e) {
    const { db: t, auth: s, realtime: r, global: n } = i,
      { db: o, auth: a, realtime: c, global: h } = e,
      l = {
        db: Object.assign(Object.assign({}, o), t),
        auth: Object.assign(Object.assign({}, a), s),
        realtime: Object.assign(Object.assign({}, c), r),
        global: Object.assign(Object.assign({}, h), n),
        accessToken: () =>
          Gs(this, void 0, void 0, function* () {
            return "";
          }),
      };
    return (
      i.accessToken ? (l.accessToken = i.accessToken) : delete l.accessToken, l
    );
  }
  const At = "2.68.0",
    de = 30 * 1e3,
    Ke = 3,
    Ve = Ke * de,
    Qs = "http://localhost:9999",
    Ys = "supabase.auth.token",
    Xs = { "X-Client-Info": `gotrue-js/${At}` },
    Qe = "X-Supabase-Api-Version",
    Ct = {
      "2024-01-01": {
        timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
        name: "2024-01-01",
      },
    };
  function Zs(i) {
    return Math.round(Date.now() / 1e3) + i;
  }
  function er() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (i) {
        const e = (Math.random() * 16) | 0;
        return (i == "x" ? e : (e & 3) | 8).toString(16);
      }
    );
  }
  const F = () => typeof window < "u" && typeof document < "u",
    X = { tested: !1, writable: !1 },
    we = () => {
      if (!F()) return !1;
      try {
        if (typeof globalThis.localStorage != "object") return !1;
      } catch {
        return !1;
      }
      if (X.tested) return X.writable;
      const i = `lswt-${Math.random()}${Math.random()}`;
      try {
        globalThis.localStorage.setItem(i, i),
          globalThis.localStorage.removeItem(i),
          (X.tested = !0),
          (X.writable = !0);
      } catch {
        (X.tested = !0), (X.writable = !1);
      }
      return X.writable;
    };
  function tr(i) {
    const e = {},
      t = new URL(i);
    if (t.hash && t.hash[0] === "#")
      try {
        new URLSearchParams(t.hash.substring(1)).forEach((r, n) => {
          e[n] = r;
        });
      } catch { }
    return (
      t.searchParams.forEach((s, r) => {
        e[r] = s;
      }),
      e
    );
  }
  const Rt = (i) => {
    let e;
    return (
      i
        ? (e = i)
        : typeof fetch > "u"
          ? (e = (...t) =>
            se(async () => {
              const { default: s } = await Promise.resolve().then(() => le);
              return { default: s };
            }, void 0).then(({ default: s }) => s(...t)))
          : (e = fetch),
      (...t) => e(...t)
    );
  },
    sr = (i) =>
      typeof i == "object" &&
      i !== null &&
      "status" in i &&
      "ok" in i &&
      "json" in i &&
      typeof i.json == "function",
    xt = async (i, e, t) => {
      await i.setItem(e, JSON.stringify(t));
    },
    Oe = async (i, e) => {
      const t = await i.getItem(e);
      if (!t) return null;
      try {
        return JSON.parse(t);
      } catch {
        return t;
      }
    },
    Pe = async (i, e) => {
      await i.removeItem(e);
    };
  function rr(i) {
    const e =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let t = "",
      s,
      r,
      n,
      o,
      a,
      c,
      h,
      l = 0;
    for (i = i.replace("-", "+").replace("_", "/"); l < i.length;)
      (o = e.indexOf(i.charAt(l++))),
        (a = e.indexOf(i.charAt(l++))),
        (c = e.indexOf(i.charAt(l++))),
        (h = e.indexOf(i.charAt(l++))),
        (s = (o << 2) | (a >> 4)),
        (r = ((a & 15) << 4) | (c >> 2)),
        (n = ((c & 3) << 6) | h),
        (t = t + String.fromCharCode(s)),
        c != 64 && r != 0 && (t = t + String.fromCharCode(r)),
        h != 64 && n != 0 && (t = t + String.fromCharCode(n));
    return t;
  }
  class $e {
    constructor() {
      this.promise = new $e.promiseConstructor((e, t) => {
        (this.resolve = e), (this.reject = t);
      });
    }
  }
  $e.promiseConstructor = Promise;
  function It(i) {
    const e = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i,
      t = i.split(".");
    if (t.length !== 3)
      throw new Error("JWT is not valid: not a JWT structure");
    if (!e.test(t[1]))
      throw new Error("JWT is not valid: payload is not in base64url format");
    const s = t[1];
    return JSON.parse(rr(s));
  }
  async function nr(i) {
    return await new Promise((e) => {
      setTimeout(() => e(null), i);
    });
  }
  function ir(i, e) {
    return new Promise((s, r) => {
      (async () => {
        for (let n = 0; n < 1 / 0; n++)
          try {
            const o = await i(n);
            if (!e(n, null, o)) {
              s(o);
              return;
            }
          } catch (o) {
            if (!e(n, o)) {
              r(o);
              return;
            }
          }
      })();
    });
  }
  function or(i) {
    return ("0" + i.toString(16)).substr(-2);
  }
  function ar() {
    const e = new Uint32Array(56);
    if (typeof crypto > "u") {
      const t =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",
        s = t.length;
      let r = "";
      for (let n = 0; n < 56; n++) r += t.charAt(Math.floor(Math.random() * s));
      return r;
    }
    return crypto.getRandomValues(e), Array.from(e, or).join("");
  }
  async function cr(i) {
    const t = new TextEncoder().encode(i),
      s = await crypto.subtle.digest("SHA-256", t),
      r = new Uint8Array(s);
    return Array.from(r)
      .map((n) => String.fromCharCode(n))
      .join("");
  }
  function lr(i) {
    return btoa(i).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  async function hr(i) {
    if (
      !(
        typeof crypto < "u" &&
        typeof crypto.subtle < "u" &&
        typeof TextEncoder < "u"
      )
    )
      return (
        console.warn(
          "WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."
        ),
        i
      );
    const t = await cr(i);
    return lr(t);
  }
  async function fe(i, e, t = !1) {
    const s = ar();
    let r = s;
    t && (r += "/PASSWORD_RECOVERY"), await xt(i, `${e}-code-verifier`, r);
    const n = await hr(s);
    return [n, s === n ? "plain" : "s256"];
  }
  const ur = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
  function dr(i) {
    const e = i.headers.get(Qe);
    if (!e || !e.match(ur)) return null;
    try {
      return new Date(`${e}T00:00:00.0Z`);
    } catch {
      return null;
    }
  }
  class Ye extends Error {
    constructor(e, t, s) {
      super(e),
        (this.__isAuthError = !0),
        (this.name = "AuthError"),
        (this.status = t),
        (this.code = s);
    }
  }
  function y(i) {
    return typeof i == "object" && i !== null && "__isAuthError" in i;
  }
  class fr extends Ye {
    constructor(e, t, s) {
      super(e, t, s),
        (this.name = "AuthApiError"),
        (this.status = t),
        (this.code = s);
    }
  }
  function pr(i) {
    return y(i) && i.name === "AuthApiError";
  }
  class Lt extends Ye {
    constructor(e, t) {
      super(e), (this.name = "AuthUnknownError"), (this.originalError = t);
    }
  }
  class Z extends Ye {
    constructor(e, t, s, r) {
      super(e, s, r), (this.name = t), (this.status = s);
    }
  }
  class J extends Z {
    constructor() {
      super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
    }
  }
  function gr(i) {
    return y(i) && i.name === "AuthSessionMissingError";
  }
  class Xe extends Z {
    constructor() {
      super(
        "Auth session or user missing",
        "AuthInvalidTokenResponseError",
        500,
        void 0
      );
    }
  }
  class je extends Z {
    constructor(e) {
      super(e, "AuthInvalidCredentialsError", 400, void 0);
    }
  }
  class Ae extends Z {
    constructor(e, t = null) {
      super(e, "AuthImplicitGrantRedirectError", 500, void 0),
        (this.details = null),
        (this.details = t);
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details,
      };
    }
  }
  function _r(i) {
    return y(i) && i.name === "AuthImplicitGrantRedirectError";
  }
  class Ut extends Z {
    constructor(e, t = null) {
      super(e, "AuthPKCEGrantCodeExchangeError", 500, void 0),
        (this.details = null),
        (this.details = t);
    }
    toJSON() {
      return {
        name: this.name,
        message: this.message,
        status: this.status,
        details: this.details,
      };
    }
  }
  class Ze extends Z {
    constructor(e, t) {
      super(e, "AuthRetryableFetchError", t, void 0);
    }
  }
  function et(i) {
    return y(i) && i.name === "AuthRetryableFetchError";
  }
  class Dt extends Z {
    constructor(e, t, s) {
      super(e, "AuthWeakPasswordError", t, "weak_password"), (this.reasons = s);
    }
  }
  var vr = function (i, e) {
    var t = {};
    for (var s in i)
      Object.prototype.hasOwnProperty.call(i, s) &&
        e.indexOf(s) < 0 &&
        (t[s] = i[s]);
    if (i != null && typeof Object.getOwnPropertySymbols == "function")
      for (var r = 0, s = Object.getOwnPropertySymbols(i); r < s.length; r++)
        e.indexOf(s[r]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(i, s[r]) &&
          (t[s[r]] = i[s[r]]);
    return t;
  };
  const ee = (i) =>
    i.msg || i.message || i.error_description || i.error || JSON.stringify(i),
    mr = [502, 503, 504];
  async function Bt(i) {
    var e;
    if (!sr(i)) throw new Ze(ee(i), 0);
    if (mr.includes(i.status)) throw new Ze(ee(i), i.status);
    let t;
    try {
      t = await i.json();
    } catch (n) {
      throw new Lt(ee(n), n);
    }
    let s;
    const r = dr(i);
    if (
      (r &&
        r.getTime() >= Ct["2024-01-01"].timestamp &&
        typeof t == "object" &&
        t &&
        typeof t.code == "string"
        ? (s = t.code)
        : typeof t == "object" &&
        t &&
        typeof t.error_code == "string" &&
        (s = t.error_code),
        s)
    ) {
      if (s === "weak_password")
        throw new Dt(
          ee(t),
          i.status,
          ((e = t.weak_password) === null || e === void 0
            ? void 0
            : e.reasons) || []
        );
      if (s === "session_not_found") throw new J();
    } else if (
      typeof t == "object" &&
      t &&
      typeof t.weak_password == "object" &&
      t.weak_password &&
      Array.isArray(t.weak_password.reasons) &&
      t.weak_password.reasons.length &&
      t.weak_password.reasons.reduce((n, o) => n && typeof o == "string", !0)
    )
      throw new Dt(ee(t), i.status, t.weak_password.reasons);
    throw new fr(ee(t), i.status || 500, s);
  }
  const yr = (i, e, t, s) => {
    const r = { method: i, headers: (e == null ? void 0 : e.headers) || {} };
    return i === "GET"
      ? r
      : ((r.headers = Object.assign(
        { "Content-Type": "application/json;charset=UTF-8" },
        e == null ? void 0 : e.headers
      )),
        (r.body = JSON.stringify(s)),
        Object.assign(Object.assign({}, r), t));
  };
  async function b(i, e, t, s) {
    var r;
    const n = Object.assign({}, s == null ? void 0 : s.headers);
    n[Qe] || (n[Qe] = Ct["2024-01-01"].name),
      s != null && s.jwt && (n.Authorization = `Bearer ${s.jwt}`);
    const o =
      (r = s == null ? void 0 : s.query) !== null && r !== void 0 ? r : {};
    s != null && s.redirectTo && (o.redirect_to = s.redirectTo);
    const a = Object.keys(o).length
      ? "?" + new URLSearchParams(o).toString()
      : "",
      c = await wr(
        i,
        e,
        t + a,
        { headers: n, noResolveJson: s == null ? void 0 : s.noResolveJson },
        {},
        s == null ? void 0 : s.body
      );
    return s != null && s.xform
      ? s == null
        ? void 0
        : s.xform(c)
      : { data: Object.assign({}, c), error: null };
  }
  async function wr(i, e, t, s, r, n) {
    const o = yr(e, s, r, n);
    let a;
    try {
      a = await i(t, Object.assign({}, o));
    } catch (c) {
      throw (console.error(c), new Ze(ee(c), 0));
    }
    if ((a.ok || (await Bt(a)), s != null && s.noResolveJson)) return a;
    try {
      return await a.json();
    } catch (c) {
      await Bt(c);
    }
  }
  function H(i) {
    var e;
    let t = null;
    Sr(i) &&
      ((t = Object.assign({}, i)),
        i.expires_at || (t.expires_at = Zs(i.expires_in)));
    const s = (e = i.user) !== null && e !== void 0 ? e : i;
    return { data: { session: t, user: s }, error: null };
  }
  function Nt(i) {
    const e = H(i);
    return (
      !e.error &&
      i.weak_password &&
      typeof i.weak_password == "object" &&
      Array.isArray(i.weak_password.reasons) &&
      i.weak_password.reasons.length &&
      i.weak_password.message &&
      typeof i.weak_password.message == "string" &&
      i.weak_password.reasons.reduce(
        (t, s) => t && typeof s == "string",
        !0
      ) &&
      (e.data.weak_password = i.weak_password),
      e
    );
  }
  function W(i) {
    var e;
    return {
      data: { user: (e = i.user) !== null && e !== void 0 ? e : i },
      error: null,
    };
  }
  function br(i) {
    return { data: i, error: null };
  }
  function kr(i) {
    const {
      action_link: e,
      email_otp: t,
      hashed_token: s,
      redirect_to: r,
      verification_type: n,
    } = i,
      o = vr(i, [
        "action_link",
        "email_otp",
        "hashed_token",
        "redirect_to",
        "verification_type",
      ]),
      a = {
        action_link: e,
        email_otp: t,
        hashed_token: s,
        redirect_to: r,
        verification_type: n,
      },
      c = Object.assign({}, o);
    return { data: { properties: a, user: c }, error: null };
  }
  function Er(i) {
    return i;
  }
  function Sr(i) {
    return i.access_token && i.refresh_token && i.expires_in;
  }
  var Tr = function (i, e) {
    var t = {};
    for (var s in i)
      Object.prototype.hasOwnProperty.call(i, s) &&
        e.indexOf(s) < 0 &&
        (t[s] = i[s]);
    if (i != null && typeof Object.getOwnPropertySymbols == "function")
      for (var r = 0, s = Object.getOwnPropertySymbols(i); r < s.length; r++)
        e.indexOf(s[r]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(i, s[r]) &&
          (t[s[r]] = i[s[r]]);
    return t;
  };
  class Or {
    constructor({ url: e = "", headers: t = {}, fetch: s }) {
      (this.url = e),
        (this.headers = t),
        (this.fetch = Rt(s)),
        (this.mfa = {
          listFactors: this._listFactors.bind(this),
          deleteFactor: this._deleteFactor.bind(this),
        });
    }
    async signOut(e, t = "global") {
      try {
        return (
          await b(this.fetch, "POST", `${this.url}/logout?scope=${t}`, {
            headers: this.headers,
            jwt: e,
            noResolveJson: !0,
          }),
          { data: null, error: null }
        );
      } catch (s) {
        if (y(s)) return { data: null, error: s };
        throw s;
      }
    }
    async inviteUserByEmail(e, t = {}) {
      try {
        return await b(this.fetch, "POST", `${this.url}/invite`, {
          body: { email: e, data: t.data },
          headers: this.headers,
          redirectTo: t.redirectTo,
          xform: W,
        });
      } catch (s) {
        if (y(s)) return { data: { user: null }, error: s };
        throw s;
      }
    }
    async generateLink(e) {
      try {
        const { options: t } = e,
          s = Tr(e, ["options"]),
          r = Object.assign(Object.assign({}, s), t);
        return (
          "newEmail" in s &&
          ((r.new_email = s == null ? void 0 : s.newEmail),
            delete r.newEmail),
          await b(this.fetch, "POST", `${this.url}/admin/generate_link`, {
            body: r,
            headers: this.headers,
            xform: kr,
            redirectTo: t == null ? void 0 : t.redirectTo,
          })
        );
      } catch (t) {
        if (y(t)) return { data: { properties: null, user: null }, error: t };
        throw t;
      }
    }
    async createUser(e) {
      try {
        return await b(this.fetch, "POST", `${this.url}/admin/users`, {
          body: e,
          headers: this.headers,
          xform: W,
        });
      } catch (t) {
        if (y(t)) return { data: { user: null }, error: t };
        throw t;
      }
    }
    async listUsers(e) {
      var t, s, r, n, o, a, c;
      try {
        const h = { nextPage: null, lastPage: 0, total: 0 },
          l = await b(this.fetch, "GET", `${this.url}/admin/users`, {
            headers: this.headers,
            noResolveJson: !0,
            query: {
              page:
                (s =
                  (t = e == null ? void 0 : e.page) === null || t === void 0
                    ? void 0
                    : t.toString()) !== null && s !== void 0
                  ? s
                  : "",
              per_page:
                (n =
                  (r = e == null ? void 0 : e.perPage) === null || r === void 0
                    ? void 0
                    : r.toString()) !== null && n !== void 0
                  ? n
                  : "",
            },
            xform: Er,
          });
        if (l.error) throw l.error;
        const u = await l.json(),
          d =
            (o = l.headers.get("x-total-count")) !== null && o !== void 0
              ? o
              : 0,
          f =
            (c =
              (a = l.headers.get("link")) === null || a === void 0
                ? void 0
                : a.split(",")) !== null && c !== void 0
              ? c
              : [];
        return (
          f.length > 0 &&
          (f.forEach((p) => {
            const k = parseInt(p.split(";")[0].split("=")[1].substring(0, 1)),
              v = JSON.parse(p.split(";")[1].split("=")[1]);
            h[`${v}Page`] = k;
          }),
            (h.total = parseInt(d))),
          { data: Object.assign(Object.assign({}, u), h), error: null }
        );
      } catch (h) {
        if (y(h)) return { data: { users: [] }, error: h };
        throw h;
      }
    }
    async getUserById(e) {
      try {
        return await b(this.fetch, "GET", `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          xform: W,
        });
      } catch (t) {
        if (y(t)) return { data: { user: null }, error: t };
        throw t;
      }
    }
    async updateUserById(e, t) {
      try {
        return await b(this.fetch, "PUT", `${this.url}/admin/users/${e}`, {
          body: t,
          headers: this.headers,
          xform: W,
        });
      } catch (s) {
        if (y(s)) return { data: { user: null }, error: s };
        throw s;
      }
    }
    async deleteUser(e, t = !1) {
      try {
        return await b(this.fetch, "DELETE", `${this.url}/admin/users/${e}`, {
          headers: this.headers,
          body: { should_soft_delete: t },
          xform: W,
        });
      } catch (s) {
        if (y(s)) return { data: { user: null }, error: s };
        throw s;
      }
    }
    async _listFactors(e) {
      try {
        const { data: t, error: s } = await b(
          this.fetch,
          "GET",
          `${this.url}/admin/users/${e.userId}/factors`,
          {
            headers: this.headers,
            xform: (r) => ({ data: { factors: r }, error: null }),
          }
        );
        return { data: t, error: s };
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
    async _deleteFactor(e) {
      try {
        return {
          data: await b(
            this.fetch,
            "DELETE",
            `${this.url}/admin/users/${e.userId}/factors/${e.id}`,
            { headers: this.headers }
          ),
          error: null,
        };
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
  }
  const Pr = {
    getItem: (i) => (we() ? globalThis.localStorage.getItem(i) : null),
    setItem: (i, e) => {
      we() && globalThis.localStorage.setItem(i, e);
    },
    removeItem: (i) => {
      we() && globalThis.localStorage.removeItem(i);
    },
  };
  function Mt(i = {}) {
    return {
      getItem: (e) => i[e] || null,
      setItem: (e, t) => {
        i[e] = t;
      },
      removeItem: (e) => {
        delete i[e];
      },
    };
  }
  function $r() {
    if (typeof globalThis != "object")
      try {
        Object.defineProperty(Object.prototype, "__magic__", {
          get: function () {
            return this;
          },
          configurable: !0,
        }),
          (__magic__.globalThis = __magic__),
          delete Object.prototype.__magic__;
      } catch {
        typeof self < "u" && (self.globalThis = self);
      }
  }
  const pe = {
    debug: !!(
      globalThis &&
      we() &&
      globalThis.localStorage &&
      globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") ===
      "true"
    ),
  };
  class Ft extends Error {
    constructor(e) {
      super(e), (this.isAcquireTimeout = !0);
    }
  }
  class jr extends Ft { }
  async function Ar(i, e, t) {
    pe.debug &&
      console.log("@supabase/gotrue-js: navigatorLock: acquire lock", i, e);
    const s = new globalThis.AbortController();
    return (
      e > 0 &&
      setTimeout(() => {
        s.abort(),
          pe.debug &&
          console.log(
            "@supabase/gotrue-js: navigatorLock acquire timed out",
            i
          );
      }, e),
      await Promise.resolve().then(() =>
        globalThis.navigator.locks.request(
          i,
          e === 0
            ? { mode: "exclusive", ifAvailable: !0 }
            : { mode: "exclusive", signal: s.signal },
          async (r) => {
            if (r) {
              pe.debug &&
                console.log(
                  "@supabase/gotrue-js: navigatorLock: acquired",
                  i,
                  r.name
                );
              try {
                return await t();
              } finally {
                pe.debug &&
                  console.log(
                    "@supabase/gotrue-js: navigatorLock: released",
                    i,
                    r.name
                  );
              }
            } else {
              if (e === 0)
                throw (
                  (pe.debug &&
                    console.log(
                      "@supabase/gotrue-js: navigatorLock: not immediately available",
                      i
                    ),
                    new jr(
                      `Acquiring an exclusive Navigator LockManager lock "${i}" immediately failed`
                    ))
                );
              if (pe.debug)
                try {
                  const n = await globalThis.navigator.locks.query();
                  console.log(
                    "@supabase/gotrue-js: Navigator LockManager state",
                    JSON.stringify(n, null, "  ")
                  );
                } catch (n) {
                  console.warn(
                    "@supabase/gotrue-js: Error when querying Navigator LockManager state",
                    n
                  );
                }
              return (
                console.warn(
                  "@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"
                ),
                await t()
              );
            }
          }
        )
      )
    );
  }
  $r();
  const Cr = {
    url: Qs,
    storageKey: Ys,
    autoRefreshToken: !0,
    persistSession: !0,
    detectSessionInUrl: !0,
    headers: Xs,
    flowType: "implicit",
    debug: !1,
    hasCustomAuthorizationHeader: !1,
  };
  async function qt(i, e, t) {
    return await t();
  }
  class be {
    constructor(e) {
      var t, s;
      (this.memoryStorage = null),
        (this.stateChangeEmitters = new Map()),
        (this.autoRefreshTicker = null),
        (this.visibilityChangedCallback = null),
        (this.refreshingDeferred = null),
        (this.initializePromise = null),
        (this.detectSessionInUrl = !0),
        (this.hasCustomAuthorizationHeader = !1),
        (this.suppressGetSessionWarning = !1),
        (this.lockAcquired = !1),
        (this.pendingInLock = []),
        (this.broadcastChannel = null),
        (this.logger = console.log),
        (this.instanceID = be.nextInstanceID),
        (be.nextInstanceID += 1),
        this.instanceID > 0 &&
        F() &&
        console.warn(
          "Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key."
        );
      const r = Object.assign(Object.assign({}, Cr), e);
      if (
        ((this.logDebugMessages = !!r.debug),
          typeof r.debug == "function" && (this.logger = r.debug),
          (this.persistSession = r.persistSession),
          (this.storageKey = r.storageKey),
          (this.autoRefreshToken = r.autoRefreshToken),
          (this.admin = new Or({
            url: r.url,
            headers: r.headers,
            fetch: r.fetch,
          })),
          (this.url = r.url),
          (this.headers = r.headers),
          (this.fetch = Rt(r.fetch)),
          (this.lock = r.lock || qt),
          (this.detectSessionInUrl = r.detectSessionInUrl),
          (this.flowType = r.flowType),
          (this.hasCustomAuthorizationHeader = r.hasCustomAuthorizationHeader),
          r.lock
            ? (this.lock = r.lock)
            : F() &&
              !(
                (t = globalThis == null ? void 0 : globalThis.navigator) ===
                null || t === void 0
              ) &&
              t.locks
              ? (this.lock = Ar)
              : (this.lock = qt),
          (this.mfa = {
            verify: this._verify.bind(this),
            enroll: this._enroll.bind(this),
            unenroll: this._unenroll.bind(this),
            challenge: this._challenge.bind(this),
            listFactors: this._listFactors.bind(this),
            challengeAndVerify: this._challengeAndVerify.bind(this),
            getAuthenticatorAssuranceLevel:
              this._getAuthenticatorAssuranceLevel.bind(this),
          }),
          this.persistSession
            ? r.storage
              ? (this.storage = r.storage)
              : we()
                ? (this.storage = Pr)
                : ((this.memoryStorage = {}),
                  (this.storage = Mt(this.memoryStorage)))
            : ((this.memoryStorage = {}),
              (this.storage = Mt(this.memoryStorage))),
          F() &&
          globalThis.BroadcastChannel &&
          this.persistSession &&
          this.storageKey)
      ) {
        try {
          this.broadcastChannel = new globalThis.BroadcastChannel(
            this.storageKey
          );
        } catch (n) {
          console.error(
            "Failed to create a new BroadcastChannel, multi-tab state changes will not be available",
            n
          );
        }
        (s = this.broadcastChannel) === null ||
          s === void 0 ||
          s.addEventListener("message", async (n) => {
            this._debug(
              "received broadcast notification from other tab or client",
              n
            ),
              await this._notifyAllSubscribers(
                n.data.event,
                n.data.session,
                !1
              );
          });
      }
      this.initialize();
    }
    _debug(...e) {
      return (
        this.logDebugMessages &&
        this.logger(
          `GoTrueClient@${this.instanceID
          } (${At}) ${new Date().toISOString()}`,
          ...e
        ),
        this
      );
    }
    async initialize() {
      return this.initializePromise
        ? await this.initializePromise
        : ((this.initializePromise = (async () =>
          await this._acquireLock(
            -1,
            async () => await this._initialize()
          ))()),
          await this.initializePromise);
    }
    async _initialize() {
      var e;
      try {
        const t = tr(window.location.href);
        let s = "none";
        if (
          (this._isImplicitGrantCallback(t)
            ? (s = "implicit")
            : (await this._isPKCECallback(t)) && (s = "pkce"),
            F() && this.detectSessionInUrl && s !== "none")
        ) {
          const { data: r, error: n } = await this._getSessionFromURL(t, s);
          if (n) {
            if (
              (this._debug(
                "#_initialize()",
                "error detecting session from URL",
                n
              ),
                _r(n))
            ) {
              const c =
                (e = n.details) === null || e === void 0 ? void 0 : e.code;
              if (
                c === "identity_already_exists" ||
                c === "identity_not_found" ||
                c === "single_identity_not_deletable"
              )
                return { error: n };
            }
            return await this._removeSession(), { error: n };
          }
          const { session: o, redirectType: a } = r;
          return (
            this._debug(
              "#_initialize()",
              "detected session in URL",
              o,
              "redirect type",
              a
            ),
            await this._saveSession(o),
            setTimeout(async () => {
              a === "recovery"
                ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", o)
                : await this._notifyAllSubscribers("SIGNED_IN", o);
            }, 0),
            { error: null }
          );
        }
        return await this._recoverAndRefresh(), { error: null };
      } catch (t) {
        return y(t)
          ? { error: t }
          : { error: new Lt("Unexpected error during initialization", t) };
      } finally {
        await this._handleVisibilityChange(),
          this._debug("#_initialize()", "end");
      }
    }
    async signInAnonymously(e) {
      var t, s, r;
      try {
        const n = await b(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            data:
              (s =
                (t = e == null ? void 0 : e.options) === null || t === void 0
                  ? void 0
                  : t.data) !== null && s !== void 0
                ? s
                : {},
            gotrue_meta_security: {
              captcha_token:
                (r = e == null ? void 0 : e.options) === null || r === void 0
                  ? void 0
                  : r.captchaToken,
            },
          },
          xform: H,
        }),
          { data: o, error: a } = n;
        if (a || !o) return { data: { user: null, session: null }, error: a };
        const c = o.session,
          h = o.user;
        return (
          o.session &&
          (await this._saveSession(o.session),
            await this._notifyAllSubscribers("SIGNED_IN", c)),
          { data: { user: h, session: c }, error: null }
        );
      } catch (n) {
        if (y(n)) return { data: { user: null, session: null }, error: n };
        throw n;
      }
    }
    async signUp(e) {
      var t, s, r;
      try {
        let n;
        if ("email" in e) {
          const { email: l, password: u, options: d } = e;
          let f = null,
            p = null;
          this.flowType === "pkce" &&
            ([f, p] = await fe(this.storage, this.storageKey)),
            (n = await b(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              redirectTo: d == null ? void 0 : d.emailRedirectTo,
              body: {
                email: l,
                password: u,
                data:
                  (t = d == null ? void 0 : d.data) !== null && t !== void 0
                    ? t
                    : {},
                gotrue_meta_security: {
                  captcha_token: d == null ? void 0 : d.captchaToken,
                },
                code_challenge: f,
                code_challenge_method: p,
              },
              xform: H,
            }));
        } else if ("phone" in e) {
          const { phone: l, password: u, options: d } = e;
          n = await b(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              phone: l,
              password: u,
              data:
                (s = d == null ? void 0 : d.data) !== null && s !== void 0
                  ? s
                  : {},
              channel:
                (r = d == null ? void 0 : d.channel) !== null && r !== void 0
                  ? r
                  : "sms",
              gotrue_meta_security: {
                captcha_token: d == null ? void 0 : d.captchaToken,
              },
            },
            xform: H,
          });
        } else
          throw new je(
            "You must provide either an email or phone number and a password"
          );
        const { data: o, error: a } = n;
        if (a || !o) return { data: { user: null, session: null }, error: a };
        const c = o.session,
          h = o.user;
        return (
          o.session &&
          (await this._saveSession(o.session),
            await this._notifyAllSubscribers("SIGNED_IN", c)),
          { data: { user: h, session: c }, error: null }
        );
      } catch (n) {
        if (y(n)) return { data: { user: null, session: null }, error: n };
        throw n;
      }
    }
    async signInWithPassword(e) {
      try {
        let t;
        if ("email" in e) {
          const { email: n, password: o, options: a } = e;
          t = await b(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=password`,
            {
              headers: this.headers,
              body: {
                email: n,
                password: o,
                gotrue_meta_security: {
                  captcha_token: a == null ? void 0 : a.captchaToken,
                },
              },
              xform: Nt,
            }
          );
        } else if ("phone" in e) {
          const { phone: n, password: o, options: a } = e;
          t = await b(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=password`,
            {
              headers: this.headers,
              body: {
                phone: n,
                password: o,
                gotrue_meta_security: {
                  captcha_token: a == null ? void 0 : a.captchaToken,
                },
              },
              xform: Nt,
            }
          );
        } else
          throw new je(
            "You must provide either an email or phone number and a password"
          );
        const { data: s, error: r } = t;
        return r
          ? { data: { user: null, session: null }, error: r }
          : !s || !s.session || !s.user
            ? { data: { user: null, session: null }, error: new Xe() }
            : (s.session &&
              (await this._saveSession(s.session),
                await this._notifyAllSubscribers("SIGNED_IN", s.session)),
            {
              data: Object.assign(
                { user: s.user, session: s.session },
                s.weak_password ? { weakPassword: s.weak_password } : null
              ),
              error: r,
            });
      } catch (t) {
        if (y(t)) return { data: { user: null, session: null }, error: t };
        throw t;
      }
    }
    async signInWithOAuth(e) {
      var t, s, r, n;
      return await this._handleProviderSignIn(e.provider, {
        redirectTo:
          (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo,
        scopes: (s = e.options) === null || s === void 0 ? void 0 : s.scopes,
        queryParams:
          (r = e.options) === null || r === void 0 ? void 0 : r.queryParams,
        skipBrowserRedirect:
          (n = e.options) === null || n === void 0
            ? void 0
            : n.skipBrowserRedirect,
      });
    }
    async exchangeCodeForSession(e) {
      return (
        await this.initializePromise,
        this._acquireLock(-1, async () => this._exchangeCodeForSession(e))
      );
    }
    async _exchangeCodeForSession(e) {
      const t = await Oe(this.storage, `${this.storageKey}-code-verifier`),
        [s, r] = (t ?? "").split("/");
      try {
        const { data: n, error: o } = await b(
          this.fetch,
          "POST",
          `${this.url}/token?grant_type=pkce`,
          {
            headers: this.headers,
            body: { auth_code: e, code_verifier: s },
            xform: H,
          }
        );
        if ((await Pe(this.storage, `${this.storageKey}-code-verifier`), o))
          throw o;
        return !n || !n.session || !n.user
          ? {
            data: { user: null, session: null, redirectType: null },
            error: new Xe(),
          }
          : (n.session &&
            (await this._saveSession(n.session),
              await this._notifyAllSubscribers("SIGNED_IN", n.session)),
          {
            data: Object.assign(Object.assign({}, n), {
              redirectType: r ?? null,
            }),
            error: o,
          });
      } catch (n) {
        if (y(n))
          return {
            data: { user: null, session: null, redirectType: null },
            error: n,
          };
        throw n;
      }
    }
    async signInWithIdToken(e) {
      try {
        const {
          options: t,
          provider: s,
          token: r,
          access_token: n,
          nonce: o,
        } = e,
          a = await b(
            this.fetch,
            "POST",
            `${this.url}/token?grant_type=id_token`,
            {
              headers: this.headers,
              body: {
                provider: s,
                id_token: r,
                access_token: n,
                nonce: o,
                gotrue_meta_security: {
                  captcha_token: t == null ? void 0 : t.captchaToken,
                },
              },
              xform: H,
            }
          ),
          { data: c, error: h } = a;
        return h
          ? { data: { user: null, session: null }, error: h }
          : !c || !c.session || !c.user
            ? { data: { user: null, session: null }, error: new Xe() }
            : (c.session &&
              (await this._saveSession(c.session),
                await this._notifyAllSubscribers("SIGNED_IN", c.session)),
              { data: c, error: h });
      } catch (t) {
        if (y(t)) return { data: { user: null, session: null }, error: t };
        throw t;
      }
    }
    async signInWithOtp(e) {
      var t, s, r, n, o;
      try {
        if ("email" in e) {
          const { email: a, options: c } = e;
          let h = null,
            l = null;
          this.flowType === "pkce" &&
            ([h, l] = await fe(this.storage, this.storageKey));
          const { error: u } = await b(this.fetch, "POST", `${this.url}/otp`, {
            headers: this.headers,
            body: {
              email: a,
              data:
                (t = c == null ? void 0 : c.data) !== null && t !== void 0
                  ? t
                  : {},
              create_user:
                (s = c == null ? void 0 : c.shouldCreateUser) !== null &&
                  s !== void 0
                  ? s
                  : !0,
              gotrue_meta_security: {
                captcha_token: c == null ? void 0 : c.captchaToken,
              },
              code_challenge: h,
              code_challenge_method: l,
            },
            redirectTo: c == null ? void 0 : c.emailRedirectTo,
          });
          return { data: { user: null, session: null }, error: u };
        }
        if ("phone" in e) {
          const { phone: a, options: c } = e,
            { data: h, error: l } = await b(
              this.fetch,
              "POST",
              `${this.url}/otp`,
              {
                headers: this.headers,
                body: {
                  phone: a,
                  data:
                    (r = c == null ? void 0 : c.data) !== null && r !== void 0
                      ? r
                      : {},
                  create_user:
                    (n = c == null ? void 0 : c.shouldCreateUser) !== null &&
                      n !== void 0
                      ? n
                      : !0,
                  gotrue_meta_security: {
                    captcha_token: c == null ? void 0 : c.captchaToken,
                  },
                  channel:
                    (o = c == null ? void 0 : c.channel) !== null &&
                      o !== void 0
                      ? o
                      : "sms",
                },
              }
            );
          return {
            data: {
              user: null,
              session: null,
              messageId: h == null ? void 0 : h.message_id,
            },
            error: l,
          };
        }
        throw new je("You must provide either an email or phone number.");
      } catch (a) {
        if (y(a)) return { data: { user: null, session: null }, error: a };
        throw a;
      }
    }
    async verifyOtp(e) {
      var t, s;
      try {
        let r, n;
        "options" in e &&
          ((r =
            (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo),
            (n =
              (s = e.options) === null || s === void 0
                ? void 0
                : s.captchaToken));
        const { data: o, error: a } = await b(
          this.fetch,
          "POST",
          `${this.url}/verify`,
          {
            headers: this.headers,
            body: Object.assign(Object.assign({}, e), {
              gotrue_meta_security: { captcha_token: n },
            }),
            redirectTo: r,
            xform: H,
          }
        );
        if (a) throw a;
        if (!o) throw new Error("An error occurred on token verification.");
        const c = o.session,
          h = o.user;
        return (
          c != null &&
          c.access_token &&
          (await this._saveSession(c),
            await this._notifyAllSubscribers(
              e.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN",
              c
            )),
          { data: { user: h, session: c }, error: null }
        );
      } catch (r) {
        if (y(r)) return { data: { user: null, session: null }, error: r };
        throw r;
      }
    }
    async signInWithSSO(e) {
      var t, s, r;
      try {
        let n = null,
          o = null;
        return (
          this.flowType === "pkce" &&
          ([n, o] = await fe(this.storage, this.storageKey)),
          await b(this.fetch, "POST", `${this.url}/sso`, {
            body: Object.assign(
              Object.assign(
                Object.assign(
                  Object.assign(
                    Object.assign(
                      {},
                      "providerId" in e ? { provider_id: e.providerId } : null
                    ),
                    "domain" in e ? { domain: e.domain } : null
                  ),
                  {
                    redirect_to:
                      (s =
                        (t = e.options) === null || t === void 0
                          ? void 0
                          : t.redirectTo) !== null && s !== void 0
                        ? s
                        : void 0,
                  }
                ),
                !(
                  (r = e == null ? void 0 : e.options) === null || r === void 0
                ) && r.captchaToken
                  ? {
                    gotrue_meta_security: {
                      captcha_token: e.options.captchaToken,
                    },
                  }
                  : null
              ),
              {
                skip_http_redirect: !0,
                code_challenge: n,
                code_challenge_method: o,
              }
            ),
            headers: this.headers,
            xform: br,
          })
        );
      } catch (n) {
        if (y(n)) return { data: null, error: n };
        throw n;
      }
    }
    async reauthenticate() {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () => await this._reauthenticate())
      );
    }
    async _reauthenticate() {
      try {
        return await this._useSession(async (e) => {
          const {
            data: { session: t },
            error: s,
          } = e;
          if (s) throw s;
          if (!t) throw new J();
          const { error: r } = await b(
            this.fetch,
            "GET",
            `${this.url}/reauthenticate`,
            { headers: this.headers, jwt: t.access_token }
          );
          return { data: { user: null, session: null }, error: r };
        });
      } catch (e) {
        if (y(e)) return { data: { user: null, session: null }, error: e };
        throw e;
      }
    }
    async resend(e) {
      try {
        const t = `${this.url}/resend`;
        if ("email" in e) {
          const { email: s, type: r, options: n } = e,
            { error: o } = await b(this.fetch, "POST", t, {
              headers: this.headers,
              body: {
                email: s,
                type: r,
                gotrue_meta_security: {
                  captcha_token: n == null ? void 0 : n.captchaToken,
                },
              },
              redirectTo: n == null ? void 0 : n.emailRedirectTo,
            });
          return { data: { user: null, session: null }, error: o };
        } else if ("phone" in e) {
          const { phone: s, type: r, options: n } = e,
            { data: o, error: a } = await b(this.fetch, "POST", t, {
              headers: this.headers,
              body: {
                phone: s,
                type: r,
                gotrue_meta_security: {
                  captcha_token: n == null ? void 0 : n.captchaToken,
                },
              },
            });
          return {
            data: {
              user: null,
              session: null,
              messageId: o == null ? void 0 : o.message_id,
            },
            error: a,
          };
        }
        throw new je(
          "You must provide either an email or phone number and a type"
        );
      } catch (t) {
        if (y(t)) return { data: { user: null, session: null }, error: t };
        throw t;
      }
    }
    async getSession() {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () =>
          this._useSession(async (t) => t)
        )
      );
    }
    async _acquireLock(e, t) {
      this._debug("#_acquireLock", "begin", e);
      try {
        if (this.lockAcquired) {
          const s = this.pendingInLock.length
            ? this.pendingInLock[this.pendingInLock.length - 1]
            : Promise.resolve(),
            r = (async () => (await s, await t()))();
          return (
            this.pendingInLock.push(
              (async () => {
                try {
                  await r;
                } catch { }
              })()
            ),
            r
          );
        }
        return await this.lock(`lock:${this.storageKey}`, e, async () => {
          this._debug(
            "#_acquireLock",
            "lock acquired for storage key",
            this.storageKey
          );
          try {
            this.lockAcquired = !0;
            const s = t();
            for (
              this.pendingInLock.push(
                (async () => {
                  try {
                    await s;
                  } catch { }
                })()
              ),
              await s;
              this.pendingInLock.length;

            ) {
              const r = [...this.pendingInLock];
              await Promise.all(r), this.pendingInLock.splice(0, r.length);
            }
            return await s;
          } finally {
            this._debug(
              "#_acquireLock",
              "lock released for storage key",
              this.storageKey
            ),
              (this.lockAcquired = !1);
          }
        });
      } finally {
        this._debug("#_acquireLock", "end");
      }
    }
    async _useSession(e) {
      this._debug("#_useSession", "begin");
      try {
        const t = await this.__loadSession();
        return await e(t);
      } finally {
        this._debug("#_useSession", "end");
      }
    }
    async __loadSession() {
      this._debug("#__loadSession()", "begin"),
        this.lockAcquired ||
        this._debug(
          "#__loadSession()",
          "used outside of an acquired lock!",
          new Error().stack
        );
      try {
        let e = null;
        const t = await Oe(this.storage, this.storageKey);
        if (
          (this._debug("#getSession()", "session from storage", t),
            t !== null &&
            (this._isValidSession(t)
              ? (e = t)
              : (this._debug(
                "#getSession()",
                "session from storage is not valid"
              ),
                await this._removeSession())),
            !e)
        )
          return { data: { session: null }, error: null };
        const s = e.expires_at ? e.expires_at * 1e3 - Date.now() < Ve : !1;
        if (
          (this._debug(
            "#__loadSession()",
            `session has${s ? "" : " not"} expired`,
            "expires_at",
            e.expires_at
          ),
            !s)
        ) {
          if (this.storage.isServer) {
            let o = this.suppressGetSessionWarning;
            e = new Proxy(e, {
              get: (c, h, l) => (
                !o &&
                h === "user" &&
                (console.warn(
                  "Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."
                ),
                  (o = !0),
                  (this.suppressGetSessionWarning = !0)),
                Reflect.get(c, h, l)
              ),
            });
          }
          return { data: { session: e }, error: null };
        }
        const { session: r, error: n } = await this._callRefreshToken(
          e.refresh_token
        );
        return n
          ? { data: { session: null }, error: n }
          : { data: { session: r }, error: null };
      } finally {
        this._debug("#__loadSession()", "end");
      }
    }
    async getUser(e) {
      return e
        ? await this._getUser(e)
        : (await this.initializePromise,
          await this._acquireLock(-1, async () => await this._getUser()));
    }
    async _getUser(e) {
      try {
        return e
          ? await b(this.fetch, "GET", `${this.url}/user`, {
            headers: this.headers,
            jwt: e,
            xform: W,
          })
          : await this._useSession(async (t) => {
            var s, r, n;
            const { data: o, error: a } = t;
            if (a) throw a;
            return !(
              !((s = o.session) === null || s === void 0) && s.access_token
            ) && !this.hasCustomAuthorizationHeader
              ? { data: { user: null }, error: new J() }
              : await b(this.fetch, "GET", `${this.url}/user`, {
                headers: this.headers,
                jwt:
                  (n =
                    (r = o.session) === null || r === void 0
                      ? void 0
                      : r.access_token) !== null && n !== void 0
                    ? n
                    : void 0,
                xform: W,
              });
          });
      } catch (t) {
        if (y(t))
          return (
            gr(t) &&
            (await this._removeSession(),
              await Pe(this.storage, `${this.storageKey}-code-verifier`)),
            { data: { user: null }, error: t }
          );
        throw t;
      }
    }
    async updateUser(e, t = {}) {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () => await this._updateUser(e, t))
      );
    }
    async _updateUser(e, t = {}) {
      try {
        return await this._useSession(async (s) => {
          const { data: r, error: n } = s;
          if (n) throw n;
          if (!r.session) throw new J();
          const o = r.session;
          let a = null,
            c = null;
          this.flowType === "pkce" &&
            e.email != null &&
            ([a, c] = await fe(this.storage, this.storageKey));
          const { data: h, error: l } = await b(
            this.fetch,
            "PUT",
            `${this.url}/user`,
            {
              headers: this.headers,
              redirectTo: t == null ? void 0 : t.emailRedirectTo,
              body: Object.assign(Object.assign({}, e), {
                code_challenge: a,
                code_challenge_method: c,
              }),
              jwt: o.access_token,
              xform: W,
            }
          );
          if (l) throw l;
          return (
            (o.user = h.user),
            await this._saveSession(o),
            await this._notifyAllSubscribers("USER_UPDATED", o),
            { data: { user: o.user }, error: null }
          );
        });
      } catch (s) {
        if (y(s)) return { data: { user: null }, error: s };
        throw s;
      }
    }
    _decodeJWT(e) {
      return It(e);
    }
    async setSession(e) {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () => await this._setSession(e))
      );
    }
    async _setSession(e) {
      try {
        if (!e.access_token || !e.refresh_token) throw new J();
        const t = Date.now() / 1e3;
        let s = t,
          r = !0,
          n = null;
        const o = It(e.access_token);
        if ((o.exp && ((s = o.exp), (r = s <= t)), r)) {
          const { session: a, error: c } = await this._callRefreshToken(
            e.refresh_token
          );
          if (c) return { data: { user: null, session: null }, error: c };
          if (!a) return { data: { user: null, session: null }, error: null };
          n = a;
        } else {
          const { data: a, error: c } = await this._getUser(e.access_token);
          if (c) throw c;
          (n = {
            access_token: e.access_token,
            refresh_token: e.refresh_token,
            user: a.user,
            token_type: "bearer",
            expires_in: s - t,
            expires_at: s,
          }),
            await this._saveSession(n),
            await this._notifyAllSubscribers("SIGNED_IN", n);
        }
        return { data: { user: n.user, session: n }, error: null };
      } catch (t) {
        if (y(t)) return { data: { session: null, user: null }, error: t };
        throw t;
      }
    }
    async refreshSession(e) {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () => await this._refreshSession(e))
      );
    }
    async _refreshSession(e) {
      try {
        return await this._useSession(async (t) => {
          var s;
          if (!e) {
            const { data: o, error: a } = t;
            if (a) throw a;
            e = (s = o.session) !== null && s !== void 0 ? s : void 0;
          }
          if (!(e != null && e.refresh_token)) throw new J();
          const { session: r, error: n } = await this._callRefreshToken(
            e.refresh_token
          );
          return n
            ? { data: { user: null, session: null }, error: n }
            : r
              ? { data: { user: r.user, session: r }, error: null }
              : { data: { user: null, session: null }, error: null };
        });
      } catch (t) {
        if (y(t)) return { data: { user: null, session: null }, error: t };
        throw t;
      }
    }
    async _getSessionFromURL(e, t) {
      try {
        if (!F()) throw new Ae("No browser detected.");
        if (e.error || e.error_description || e.error_code)
          throw new Ae(
            e.error_description ||
            "Error in URL with unspecified error_description",
            {
              error: e.error || "unspecified_error",
              code: e.error_code || "unspecified_code",
            }
          );
        switch (t) {
          case "implicit":
            if (this.flowType === "pkce")
              throw new Ut("Not a valid PKCE flow url.");
            break;
          case "pkce":
            if (this.flowType === "implicit")
              throw new Ae("Not a valid implicit grant flow url.");
            break;
          default:
        }
        if (t === "pkce") {
          if (
            (this._debug("#_initialize()", "begin", "is PKCE flow", !0),
              !e.code)
          )
            throw new Ut("No code detected.");
          const { data: x, error: O } = await this._exchangeCodeForSession(
            e.code
          );
          if (O) throw O;
          const $ = new URL(window.location.href);
          return (
            $.searchParams.delete("code"),
            window.history.replaceState(window.history.state, "", $.toString()),
            { data: { session: x.session, redirectType: null }, error: null }
          );
        }
        const {
          provider_token: s,
          provider_refresh_token: r,
          access_token: n,
          refresh_token: o,
          expires_in: a,
          expires_at: c,
          token_type: h,
        } = e;
        if (!n || !a || !o || !h) throw new Ae("No session defined in URL");
        const l = Math.round(Date.now() / 1e3),
          u = parseInt(a);
        let d = l + u;
        c && (d = parseInt(c));
        const f = d - l;
        f * 1e3 <= de &&
          console.warn(
            `@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`
          );
        const p = d - u;
        l - p >= 120
          ? console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",
            p,
            d,
            l
          )
          : l - p < 0 &&
          console.warn(
            "@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",
            p,
            d,
            l
          );
        const { data: k, error: v } = await this._getUser(n);
        if (v) throw v;
        const R = {
          provider_token: s,
          provider_refresh_token: r,
          access_token: n,
          expires_in: u,
          expires_at: d,
          refresh_token: o,
          token_type: h,
          user: k.user,
        };
        return (
          (window.location.hash = ""),
          this._debug("#_getSessionFromURL()", "clearing window.location.hash"),
          { data: { session: R, redirectType: e.type }, error: null }
        );
      } catch (s) {
        if (y(s))
          return { data: { session: null, redirectType: null }, error: s };
        throw s;
      }
    }
    _isImplicitGrantCallback(e) {
      return !!(e.access_token || e.error_description);
    }
    async _isPKCECallback(e) {
      const t = await Oe(this.storage, `${this.storageKey}-code-verifier`);
      return !!(e.code && t);
    }
    async signOut(e = { scope: "global" }) {
      return (
        await this.initializePromise,
        await this._acquireLock(-1, async () => await this._signOut(e))
      );
    }
    async _signOut({ scope: e } = { scope: "global" }) {
      return await this._useSession(async (t) => {
        var s;
        const { data: r, error: n } = t;
        if (n) return { error: n };
        const o =
          (s = r.session) === null || s === void 0 ? void 0 : s.access_token;
        if (o) {
          const { error: a } = await this.admin.signOut(o, e);
          if (
            a &&
            !(
              pr(a) &&
              (a.status === 404 || a.status === 401 || a.status === 403)
            )
          )
            return { error: a };
        }
        return (
          e !== "others" &&
          (await this._removeSession(),
            await Pe(this.storage, `${this.storageKey}-code-verifier`)),
          { error: null }
        );
      });
    }
    onAuthStateChange(e) {
      const t = er(),
        s = {
          id: t,
          callback: e,
          unsubscribe: () => {
            this._debug(
              "#unsubscribe()",
              "state change callback with id removed",
              t
            ),
              this.stateChangeEmitters.delete(t);
          },
        };
      return (
        this._debug("#onAuthStateChange()", "registered callback with id", t),
        this.stateChangeEmitters.set(t, s),
        (async () => (
          await this.initializePromise,
          await this._acquireLock(-1, async () => {
            this._emitInitialSession(t);
          })
        ))(),
        { data: { subscription: s } }
      );
    }
    async _emitInitialSession(e) {
      return await this._useSession(async (t) => {
        var s, r;
        try {
          const {
            data: { session: n },
            error: o,
          } = t;
          if (o) throw o;
          await ((s = this.stateChangeEmitters.get(e)) === null || s === void 0
            ? void 0
            : s.callback("INITIAL_SESSION", n)),
            this._debug("INITIAL_SESSION", "callback id", e, "session", n);
        } catch (n) {
          await ((r = this.stateChangeEmitters.get(e)) === null || r === void 0
            ? void 0
            : r.callback("INITIAL_SESSION", null)),
            this._debug("INITIAL_SESSION", "callback id", e, "error", n),
            console.error(n);
        }
      });
    }
    async resetPasswordForEmail(e, t = {}) {
      let s = null,
        r = null;
      this.flowType === "pkce" &&
        ([s, r] = await fe(this.storage, this.storageKey, !0));
      try {
        return await b(this.fetch, "POST", `${this.url}/recover`, {
          body: {
            email: e,
            code_challenge: s,
            code_challenge_method: r,
            gotrue_meta_security: { captcha_token: t.captchaToken },
          },
          headers: this.headers,
          redirectTo: t.redirectTo,
        });
      } catch (n) {
        if (y(n)) return { data: null, error: n };
        throw n;
      }
    }
    async getUserIdentities() {
      var e;
      try {
        const { data: t, error: s } = await this.getUser();
        if (s) throw s;
        return {
          data: {
            identities:
              (e = t.user.identities) !== null && e !== void 0 ? e : [],
          },
          error: null,
        };
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
    async linkIdentity(e) {
      var t;
      try {
        const { data: s, error: r } = await this._useSession(async (n) => {
          var o, a, c, h, l;
          const { data: u, error: d } = n;
          if (d) throw d;
          const f = await this._getUrlForProvider(
            `${this.url}/user/identities/authorize`,
            e.provider,
            {
              redirectTo:
                (o = e.options) === null || o === void 0
                  ? void 0
                  : o.redirectTo,
              scopes:
                (a = e.options) === null || a === void 0 ? void 0 : a.scopes,
              queryParams:
                (c = e.options) === null || c === void 0
                  ? void 0
                  : c.queryParams,
              skipBrowserRedirect: !0,
            }
          );
          return await b(this.fetch, "GET", f, {
            headers: this.headers,
            jwt:
              (l =
                (h = u.session) === null || h === void 0
                  ? void 0
                  : h.access_token) !== null && l !== void 0
                ? l
                : void 0,
          });
        });
        if (r) throw r;
        return (
          F() &&
          !(
            !((t = e.options) === null || t === void 0) &&
            t.skipBrowserRedirect
          ) &&
          window.location.assign(s == null ? void 0 : s.url),
          {
            data: { provider: e.provider, url: s == null ? void 0 : s.url },
            error: null,
          }
        );
      } catch (s) {
        if (y(s))
          return { data: { provider: e.provider, url: null }, error: s };
        throw s;
      }
    }
    async unlinkIdentity(e) {
      try {
        return await this._useSession(async (t) => {
          var s, r;
          const { data: n, error: o } = t;
          if (o) throw o;
          return await b(
            this.fetch,
            "DELETE",
            `${this.url}/user/identities/${e.identity_id}`,
            {
              headers: this.headers,
              jwt:
                (r =
                  (s = n.session) === null || s === void 0
                    ? void 0
                    : s.access_token) !== null && r !== void 0
                  ? r
                  : void 0,
            }
          );
        });
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
    async _refreshAccessToken(e) {
      const t = `#_refreshAccessToken(${e.substring(0, 5)}...)`;
      this._debug(t, "begin");
      try {
        const s = Date.now();
        return await ir(
          async (r) => (
            r > 0 && (await nr(200 * Math.pow(2, r - 1))),
            this._debug(t, "refreshing attempt", r),
            await b(
              this.fetch,
              "POST",
              `${this.url}/token?grant_type=refresh_token`,
              { body: { refresh_token: e }, headers: this.headers, xform: H }
            )
          ),
          (r, n) => {
            const o = 200 * Math.pow(2, r);
            return n && et(n) && Date.now() + o - s < de;
          }
        );
      } catch (s) {
        if ((this._debug(t, "error", s), y(s)))
          return { data: { session: null, user: null }, error: s };
        throw s;
      } finally {
        this._debug(t, "end");
      }
    }
    _isValidSession(e) {
      return (
        typeof e == "object" &&
        e !== null &&
        "access_token" in e &&
        "refresh_token" in e &&
        "expires_at" in e
      );
    }
    async _handleProviderSignIn(e, t) {
      const s = await this._getUrlForProvider(`${this.url}/authorize`, e, {
        redirectTo: t.redirectTo,
        scopes: t.scopes,
        queryParams: t.queryParams,
      });
      return (
        this._debug(
          "#_handleProviderSignIn()",
          "provider",
          e,
          "options",
          t,
          "url",
          s
        ),
        F() && !t.skipBrowserRedirect && window.location.assign(s),
        { data: { provider: e, url: s }, error: null }
      );
    }
    async _recoverAndRefresh() {
      var e;
      const t = "#_recoverAndRefresh()";
      this._debug(t, "begin");
      try {
        const s = await Oe(this.storage, this.storageKey);
        if (
          (this._debug(t, "session from storage", s), !this._isValidSession(s))
        ) {
          this._debug(t, "session is not valid"),
            s !== null && (await this._removeSession());
          return;
        }
        const r =
          ((e = s.expires_at) !== null && e !== void 0 ? e : 1 / 0) * 1e3 -
          Date.now() <
          Ve;
        if (
          (this._debug(
            t,
            `session has${r ? "" : " not"} expired with margin of ${Ve}s`
          ),
            r)
        ) {
          if (this.autoRefreshToken && s.refresh_token) {
            const { error: n } = await this._callRefreshToken(s.refresh_token);
            n &&
              (console.error(n),
                et(n) ||
                (this._debug(
                  t,
                  "refresh failed with a non-retryable error, removing the session",
                  n
                ),
                  await this._removeSession()));
          }
        } else await this._notifyAllSubscribers("SIGNED_IN", s);
      } catch (s) {
        this._debug(t, "error", s), console.error(s);
        return;
      } finally {
        this._debug(t, "end");
      }
    }
    async _callRefreshToken(e) {
      var t, s;
      if (!e) throw new J();
      if (this.refreshingDeferred) return this.refreshingDeferred.promise;
      const r = `#_callRefreshToken(${e.substring(0, 5)}...)`;
      this._debug(r, "begin");
      try {
        this.refreshingDeferred = new $e();
        const { data: n, error: o } = await this._refreshAccessToken(e);
        if (o) throw o;
        if (!n.session) throw new J();
        await this._saveSession(n.session),
          await this._notifyAllSubscribers("TOKEN_REFRESHED", n.session);
        const a = { session: n.session, error: null };
        return this.refreshingDeferred.resolve(a), a;
      } catch (n) {
        if ((this._debug(r, "error", n), y(n))) {
          const o = { session: null, error: n };
          return (
            et(n) || (await this._removeSession()),
            (t = this.refreshingDeferred) === null ||
            t === void 0 ||
            t.resolve(o),
            o
          );
        }
        throw (
          ((s = this.refreshingDeferred) === null ||
            s === void 0 ||
            s.reject(n),
            n)
        );
      } finally {
        (this.refreshingDeferred = null), this._debug(r, "end");
      }
    }
    async _notifyAllSubscribers(e, t, s = !0) {
      const r = `#_notifyAllSubscribers(${e})`;
      this._debug(r, "begin", t, `broadcast = ${s}`);
      try {
        this.broadcastChannel &&
          s &&
          this.broadcastChannel.postMessage({ event: e, session: t });
        const n = [],
          o = Array.from(this.stateChangeEmitters.values()).map(async (a) => {
            try {
              await a.callback(e, t);
            } catch (c) {
              n.push(c);
            }
          });
        if ((await Promise.all(o), n.length > 0)) {
          for (let a = 0; a < n.length; a += 1) console.error(n[a]);
          throw n[0];
        }
      } finally {
        this._debug(r, "end");
      }
    }
    async _saveSession(e) {
      this._debug("#_saveSession()", e),
        (this.suppressGetSessionWarning = !0),
        await xt(this.storage, this.storageKey, e);
    }
    async _removeSession() {
      this._debug("#_removeSession()"),
        await Pe(this.storage, this.storageKey),
        await this._notifyAllSubscribers("SIGNED_OUT", null);
    }
    _removeVisibilityChangedCallback() {
      this._debug("#_removeVisibilityChangedCallback()");
      const e = this.visibilityChangedCallback;
      this.visibilityChangedCallback = null;
      try {
        e &&
          F() &&
          window != null &&
          window.removeEventListener &&
          window.removeEventListener("visibilitychange", e);
      } catch (t) {
        console.error("removing visibilitychange callback failed", t);
      }
    }
    async _startAutoRefresh() {
      await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
      const e = setInterval(() => this._autoRefreshTokenTick(), de);
      (this.autoRefreshTicker = e),
        e && typeof e == "object" && typeof e.unref == "function"
          ? e.unref()
          : typeof Deno < "u" &&
          typeof Deno.unrefTimer == "function" &&
          Deno.unrefTimer(e),
        setTimeout(async () => {
          await this.initializePromise, await this._autoRefreshTokenTick();
        }, 0);
    }
    async _stopAutoRefresh() {
      this._debug("#_stopAutoRefresh()");
      const e = this.autoRefreshTicker;
      (this.autoRefreshTicker = null), e && clearInterval(e);
    }
    async startAutoRefresh() {
      this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
    }
    async stopAutoRefresh() {
      this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
    }
    async _autoRefreshTokenTick() {
      this._debug("#_autoRefreshTokenTick()", "begin");
      try {
        await this._acquireLock(0, async () => {
          try {
            const e = Date.now();
            try {
              return await this._useSession(async (t) => {
                const {
                  data: { session: s },
                } = t;
                if (!s || !s.refresh_token || !s.expires_at) {
                  this._debug("#_autoRefreshTokenTick()", "no session");
                  return;
                }
                const r = Math.floor((s.expires_at * 1e3 - e) / de);
                this._debug(
                  "#_autoRefreshTokenTick()",
                  `access token expires in ${r} ticks, a tick lasts ${de}ms, refresh threshold is ${Ke} ticks`
                ),
                  r <= Ke && (await this._callRefreshToken(s.refresh_token));
              });
            } catch (t) {
              console.error(
                "Auto refresh tick failed with error. This is likely a transient error.",
                t
              );
            }
          } finally {
            this._debug("#_autoRefreshTokenTick()", "end");
          }
        });
      } catch (e) {
        if (e.isAcquireTimeout || e instanceof Ft)
          this._debug("auto refresh token tick lock not available");
        else throw e;
      }
    }
    async _handleVisibilityChange() {
      if (
        (this._debug("#_handleVisibilityChange()"),
          !F() || !(window != null && window.addEventListener))
      )
        return this.autoRefreshToken && this.startAutoRefresh(), !1;
      try {
        (this.visibilityChangedCallback = async () =>
          await this._onVisibilityChanged(!1)),
          window == null ||
          window.addEventListener(
            "visibilitychange",
            this.visibilityChangedCallback
          ),
          await this._onVisibilityChanged(!0);
      } catch (e) {
        console.error("_handleVisibilityChange", e);
      }
    }
    async _onVisibilityChanged(e) {
      const t = `#_onVisibilityChanged(${e})`;
      this._debug(t, "visibilityState", document.visibilityState),
        document.visibilityState === "visible"
          ? (this.autoRefreshToken && this._startAutoRefresh(),
            e ||
            (await this.initializePromise,
              await this._acquireLock(-1, async () => {
                if (document.visibilityState !== "visible") {
                  this._debug(
                    t,
                    "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting"
                  );
                  return;
                }
                await this._recoverAndRefresh();
              })))
          : document.visibilityState === "hidden" &&
          this.autoRefreshToken &&
          this._stopAutoRefresh();
    }
    async _getUrlForProvider(e, t, s) {
      const r = [`provider=${encodeURIComponent(t)}`];
      if (
        (s != null &&
          s.redirectTo &&
          r.push(`redirect_to=${encodeURIComponent(s.redirectTo)}`),
          s != null &&
          s.scopes &&
          r.push(`scopes=${encodeURIComponent(s.scopes)}`),
          this.flowType === "pkce")
      ) {
        const [n, o] = await fe(this.storage, this.storageKey),
          a = new URLSearchParams({
            code_challenge: `${encodeURIComponent(n)}`,
            code_challenge_method: `${encodeURIComponent(o)}`,
          });
        r.push(a.toString());
      }
      if (s != null && s.queryParams) {
        const n = new URLSearchParams(s.queryParams);
        r.push(n.toString());
      }
      return (
        s != null &&
        s.skipBrowserRedirect &&
        r.push(`skip_http_redirect=${s.skipBrowserRedirect}`),
        `${e}?${r.join("&")}`
      );
    }
    async _unenroll(e) {
      try {
        return await this._useSession(async (t) => {
          var s;
          const { data: r, error: n } = t;
          return n
            ? { data: null, error: n }
            : await b(
              this.fetch,
              "DELETE",
              `${this.url}/factors/${e.factorId}`,
              {
                headers: this.headers,
                jwt:
                  (s = r == null ? void 0 : r.session) === null ||
                    s === void 0
                    ? void 0
                    : s.access_token,
              }
            );
        });
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
    async _enroll(e) {
      try {
        return await this._useSession(async (t) => {
          var s, r;
          const { data: n, error: o } = t;
          if (o) return { data: null, error: o };
          const a = Object.assign(
            { friendly_name: e.friendlyName, factor_type: e.factorType },
            e.factorType === "phone"
              ? { phone: e.phone }
              : { issuer: e.issuer }
          ),
            { data: c, error: h } = await b(
              this.fetch,
              "POST",
              `${this.url}/factors`,
              {
                body: a,
                headers: this.headers,
                jwt:
                  (s = n == null ? void 0 : n.session) === null || s === void 0
                    ? void 0
                    : s.access_token,
              }
            );
          return h
            ? { data: null, error: h }
            : (e.factorType === "totp" &&
              !((r = c == null ? void 0 : c.totp) === null || r === void 0) &&
              r.qr_code &&
              (c.totp.qr_code = `data:image/svg+xml;utf-8,${c.totp.qr_code}`),
              { data: c, error: null });
        });
      } catch (t) {
        if (y(t)) return { data: null, error: t };
        throw t;
      }
    }
    async _verify(e) {
      return this._acquireLock(-1, async () => {
        try {
          return await this._useSession(async (t) => {
            var s;
            const { data: r, error: n } = t;
            if (n) return { data: null, error: n };
            const { data: o, error: a } = await b(
              this.fetch,
              "POST",
              `${this.url}/factors/${e.factorId}/verify`,
              {
                body: { code: e.code, challenge_id: e.challengeId },
                headers: this.headers,
                jwt:
                  (s = r == null ? void 0 : r.session) === null || s === void 0
                    ? void 0
                    : s.access_token,
              }
            );
            return a
              ? { data: null, error: a }
              : (await this._saveSession(
                Object.assign(
                  { expires_at: Math.round(Date.now() / 1e3) + o.expires_in },
                  o
                )
              ),
                await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", o),
                { data: o, error: a });
          });
        } catch (t) {
          if (y(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
    async _challenge(e) {
      return this._acquireLock(-1, async () => {
        try {
          return await this._useSession(async (t) => {
            var s;
            const { data: r, error: n } = t;
            return n
              ? { data: null, error: n }
              : await b(
                this.fetch,
                "POST",
                `${this.url}/factors/${e.factorId}/challenge`,
                {
                  body: { channel: e.channel },
                  headers: this.headers,
                  jwt:
                    (s = r == null ? void 0 : r.session) === null ||
                      s === void 0
                      ? void 0
                      : s.access_token,
                }
              );
          });
        } catch (t) {
          if (y(t)) return { data: null, error: t };
          throw t;
        }
      });
    }
    async _challengeAndVerify(e) {
      const { data: t, error: s } = await this._challenge({
        factorId: e.factorId,
      });
      return s
        ? { data: null, error: s }
        : await this._verify({
          factorId: e.factorId,
          challengeId: t.id,
          code: e.code,
        });
    }
    async _listFactors() {
      const {
        data: { user: e },
        error: t,
      } = await this.getUser();
      if (t) return { data: null, error: t };
      const s = (e == null ? void 0 : e.factors) || [],
        r = s.filter(
          (o) => o.factor_type === "totp" && o.status === "verified"
        ),
        n = s.filter(
          (o) => o.factor_type === "phone" && o.status === "verified"
        );
      return { data: { all: s, totp: r, phone: n }, error: null };
    }
    async _getAuthenticatorAssuranceLevel() {
      return this._acquireLock(
        -1,
        async () =>
          await this._useSession(async (e) => {
            var t, s;
            const {
              data: { session: r },
              error: n,
            } = e;
            if (n) return { data: null, error: n };
            if (!r)
              return {
                data: {
                  currentLevel: null,
                  nextLevel: null,
                  currentAuthenticationMethods: [],
                },
                error: null,
              };
            const o = this._decodeJWT(r.access_token);
            let a = null;
            o.aal && (a = o.aal);
            let c = a;
            ((s =
              (t = r.user.factors) === null || t === void 0
                ? void 0
                : t.filter((u) => u.status === "verified")) !== null &&
              s !== void 0
              ? s
              : []
            ).length > 0 && (c = "aal2");
            const l = o.amr || [];
            return {
              data: {
                currentLevel: a,
                nextLevel: c,
                currentAuthenticationMethods: l,
              },
              error: null,
            };
          })
      );
    }
  }
  be.nextInstanceID = 0;
  const Rr = be;
  class xr extends Rr {
    constructor(e) {
      super(e);
    }
  }
  var Ir = function (i, e, t, s) {
    function r(n) {
      return n instanceof t
        ? n
        : new t(function (o) {
          o(n);
        });
    }
    return new (t || (t = Promise))(function (n, o) {
      function a(l) {
        try {
          h(s.next(l));
        } catch (u) {
          o(u);
        }
      }
      function c(l) {
        try {
          h(s.throw(l));
        } catch (u) {
          o(u);
        }
      }
      function h(l) {
        l.done ? n(l.value) : r(l.value).then(a, c);
      }
      h((s = s.apply(i, e || [])).next());
    });
  };
  class Lr {
    constructor(e, t, s) {
      var r, n, o;
      if (((this.supabaseUrl = e), (this.supabaseKey = t), !e))
        throw new Error("supabaseUrl is required.");
      if (!t) throw new Error("supabaseKey is required.");
      const a = Ks(e);
      (this.realtimeUrl = `${a}/realtime/v1`.replace(/^http/i, "ws")),
        (this.authUrl = `${a}/auth/v1`),
        (this.storageUrl = `${a}/storage/v1`),
        (this.functionsUrl = `${a}/functions/v1`);
      const c = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`,
        h = {
          db: Ms,
          realtime: qs,
          auth: Object.assign(Object.assign({}, Fs), { storageKey: c }),
          global: Ns,
        },
        l = Vs(s ?? {}, h);
      (this.storageKey =
        (r = l.auth.storageKey) !== null && r !== void 0 ? r : ""),
        (this.headers =
          (n = l.global.headers) !== null && n !== void 0 ? n : {}),
        l.accessToken
          ? ((this.accessToken = l.accessToken),
            (this.auth = new Proxy(
              {},
              {
                get: (u, d) => {
                  throw new Error(
                    `@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(
                      d
                    )} is not possible`
                  );
                },
              }
            )))
          : (this.auth = this._initSupabaseAuthClient(
            (o = l.auth) !== null && o !== void 0 ? o : {},
            this.headers,
            l.global.fetch
          )),
        (this.fetch = Ws(t, this._getAccessToken.bind(this), l.global.fetch)),
        (this.realtime = this._initRealtimeClient(
          Object.assign(
            {
              headers: this.headers,
              accessToken: this._getAccessToken.bind(this),
            },
            l.realtime
          )
        )),
        (this.rest = new hs(`${a}/rest/v1`, {
          headers: this.headers,
          schema: l.db.schema,
          fetch: this.fetch,
        })),
        l.accessToken || this._listenForAuthEvents();
    }
    get functions() {
      return new Yt(this.functionsUrl, {
        headers: this.headers,
        customFetch: this.fetch,
      });
    }
    get storage() {
      return new Ds(this.storageUrl, this.headers, this.fetch);
    }
    from(e) {
      return this.rest.from(e);
    }
    schema(e) {
      return this.rest.schema(e);
    }
    rpc(e, t = {}, s = {}) {
      return this.rest.rpc(e, t, s);
    }
    channel(e, t = { config: {} }) {
      return this.realtime.channel(e, t);
    }
    getChannels() {
      return this.realtime.getChannels();
    }
    removeChannel(e) {
      return this.realtime.removeChannel(e);
    }
    removeAllChannels() {
      return this.realtime.removeAllChannels();
    }
    _getAccessToken() {
      var e, t;
      return Ir(this, void 0, void 0, function* () {
        if (this.accessToken) return yield this.accessToken();
        const { data: s } = yield this.auth.getSession();
        return (t =
          (e = s.session) === null || e === void 0
            ? void 0
            : e.access_token) !== null && t !== void 0
          ? t
          : null;
      });
    }
    _initSupabaseAuthClient(
      {
        autoRefreshToken: e,
        persistSession: t,
        detectSessionInUrl: s,
        storage: r,
        storageKey: n,
        flowType: o,
        lock: a,
        debug: c,
      },
      h,
      l
    ) {
      const u = {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: `${this.supabaseKey}`,
      };
      return new xr({
        url: this.authUrl,
        headers: Object.assign(Object.assign({}, u), h),
        storageKey: n,
        autoRefreshToken: e,
        persistSession: t,
        detectSessionInUrl: s,
        storage: r,
        flowType: o,
        lock: a,
        debug: c,
        fetch: l,
        hasCustomAuthorizationHeader: "Authorization" in this.headers,
      });
    }
    _initRealtimeClient(e) {
      return new Ss(
        this.realtimeUrl,
        Object.assign(Object.assign({}, e), {
          params: Object.assign(
            { apikey: this.supabaseKey },
            e == null ? void 0 : e.params
          ),
        })
      );
    }
    _listenForAuthEvents() {
      return this.auth.onAuthStateChange((t, s) => {
        this._handleTokenChanged(
          t,
          "CLIENT",
          s == null ? void 0 : s.access_token
        );
      });
    }
    _handleTokenChanged(e, t, s) {
      (e === "TOKEN_REFRESHED" || e === "SIGNED_IN") &&
        this.changedAccessToken !== s
        ? (this.changedAccessToken = s)
        : e === "SIGNED_OUT" &&
        (this.realtime.setAuth(),
          t == "STORAGE" && this.auth.signOut(),
          (this.changedAccessToken = void 0));
    }
  }
  const Ur = (i, e, t) => new Lr(i, e, t);
  if (typeof window.CONFIG > "u")
    throw (
      (console.error("CONFIG is not defined. Ensure config.js is loaded."),
        new Error("Config file failed to load"))
    );
  const G = Ur(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY, {
    auth: {
      storage: {
        getItem: (i) =>
          new Promise((e) => {
            chrome.storage.local.get(i, (t) => e(t[i] || null));
          }),
        setItem: (i, e) =>
          new Promise((t) => {
            chrome.storage.local.set({ [i]: e }, () => t());
          }),
        removeItem: (i) =>
          new Promise((e) => {
            chrome.storage.local.remove(i, () => e());
          }),
      },
      persistSession: !0,
    },
  }),
    Dr = window.CONFIG.TMDB_API_KEY;
  let tt = [],
    M = 1,
    Ce = 1;
  const Br = {
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
      { id: 10759, name: "Action & Adventure" },
      { id: 10762, name: "Kids" },
      { id: 10763, name: "News" },
      { id: 10764, name: "Reality" },
      { id: 10765, name: "Sci-Fi & Fantasy" },
      { id: 10766, name: "Soap" },
      { id: 10767, name: "Talk" },
      { id: 10768, name: "War & Politics" },
    ],
  };
  document.addEventListener("DOMContentLoaded", async () => {
    const i = document.getElementById("auth-container"),
      e = document.getElementById("content-container"),
      t = document.getElementById("login-btn"),
      s = document.getElementById("logout-btn"),
      r = document.getElementById("auth-message"),
      n = document.getElementById("welcome-text"),
      o = document.getElementById("search-input"),
      a = document.getElementById("search-btn"),
      c = document.getElementById("media-type-filter"),
      h = document.getElementById("results"),
      l = document.getElementById("response-message"),
      u = document.getElementById("prev-btn"),
      d = document.getElementById("next-btn"),
      f = document.getElementById("page-info"),
      p = document.getElementById("confirm-modal"),
      k = document.getElementById("confirm-message"),
      v = document.getElementById("confirm-yes"),
      R = document.getElementById("confirm-no"),
      x = document.getElementById("loading");
    let O = null;
    (x.style.display = "flex"),
      (i.style.display = "none"),
      (e.style.display = "none");
    try {
      (O = await $()),
        O
          ? ((x.style.display = "none"),
            (e.style.display = "block"),
            (n.textContent = `Welcome, ${O.email.split("@")[0]}`))
          : ((x.style.display = "none"), (i.style.display = "block"));
    } catch (g) {
      console.log("Error during user authentication:", g.message),
        (x.style.display = "none"),
        (i.style.display = "block");
    }
    t.addEventListener("click", async () => {
      const g = document.getElementById("email").value,
        w = document.getElementById("password").value;
      (r.textContent = "Loading..."), (r.style.color = "#60a5fa");
      try {
        (O = await C(g, w)),
          (i.style.display = "none"),
          (e.style.display = "block"),
          (r.textContent = ""),
          (n.textContent = `Welcome, ${O.email.split("@")[0]}`);
      } catch (S) {
        (r.textContent = S.message.includes("invalid")
          ? "Wrong password or email"
          : "Error: " + S.message),
          (r.style.color = "#f87171");
      }
    }),
      s.addEventListener("click", async () => {
        await qr(),
          (i.style.display = "block"),
          (e.style.display = "none"),
          (r.textContent = "");
      }),
      a.addEventListener("click", () => {
        (M = 1), Ee(o.value, c.value);
      }),
      o.addEventListener("keypress", (g) => {
        g.key === "Enter" && ((M = 1), Ee(o.value, c.value));
      }),
      u.addEventListener("click", () => {
        M > 1 && (M--, Ee(o.value, c.value));
      }),
      d.addEventListener("click", () => {
        M < Ce && (M++, Ee(o.value, c.value));
      }),
      c.addEventListener("change", () => {
        (M = 1), Ee(o.value, c.value);
      });
    async function $() {
      const {
        data: { user: g },
        error: w,
      } = await G.auth.getUser();
      if (w) throw w;
      return g;
    }
    async function C(g, w) {
      const { data: S, error: _ } = await G.auth.signInWithPassword({
        email: g,
        password: w,
      });
      if (_) throw _;
      return S.user;
    }
    async function qr() {
      const { error: g } = await G.auth.signOut();
      if (g) throw g;
    }
    async function Re(g, w) {
      const _ = {
        watched: "increment_watched_count",
        favorite: "increment_favorites_count",
        watchlater: "increment_watchlist_count",
      }[w],
        { error: m } = await G.rpc(_, { p_user_id: g });
      if (m) throw new Error(`Failed to increment ${w} count: ${m.message}`);
    }
    async function xe(g, w) {
      const _ = {
        watched: "decrement_watched_count",
        favorite: "decrement_favorites_count",
        watchlater: "decrement_watchlist_count",
      }[w],
        { error: m } = await G.rpc(_, { p_user_id: g });
      if (m) throw new Error(`Failed to decrement ${w} count: ${m.message}`);
    }
    async function Ie(g, w, S) {
      const { error: _ } = await G.from(S)
        .delete()
        .eq("user_id", g)
        .eq("item_id", w);
      if (_) throw new Error(`Failed to delete from ${S}: ${_.message}`);
    }
    async function Le(g, w, S, _, m, E, I, B) {
      const D = {
        watchlater: "user_watchlist",
        watched: "watched_items",
        favorite: "favorite_items",
      }[_],
        K = {
          user_id: g,
          item_id: w,
          item_type: S,
          item_name: m,
          image_url: E,
          item_adult: I,
          genres: B,
        };
      _ === "watchlater"
        ? (K.added_at = new Date().toISOString())
        : _ === "watched" && (K.watched_at = new Date().toISOString());
      const { data: Ue, error: V } = await G.from(D).upsert(K, {
        onConflict: ["user_id", "item_id"],
      });
      if (V) throw new Error(`Failed to save ${_}: ${V.message}`);
      return Ue;
    }
    async function zr(g, w, S) {
      var Ue;
      const _ = await $();
      if (!_) throw new Error("User not authenticated");
      const m = _.id,
        E = w.id,
        I = c.value,
        B = w.title || w.name,
        P = w.poster_path
          ? `https://image.tmdb.org/t/p/w185${w.poster_path}`
          : null,
        D = w.adult || !1,
        K =
          ((Ue = w.genre_ids) == null
            ? void 0
            : Ue.map((V) => {
              const te = Br.genres.find((Ht) => Ht.id === V);
              return te ? te.name : null;
            }).filter(Boolean)) || [];
      return (
        (k.textContent = `Are you sure you want to mark this as ${g}?`),
        (p.style.display = "flex"),
        new Promise((V) => {
          (v.onclick = async () => {
            p.style.display = "none";
            try {
              g === "watched"
                ? (await Le(m, E, I, "watched", B, P, D, K),
                  await Re(m, "watched"),
                  (await ke(m, E, "user_watchlist")) &&
                  (await Ie(m, E, "user_watchlist"),
                    await xe(m, "watchlater")))
                : g === "favorite"
                  ? (await Le(m, E, I, "favorite", B, P, D, K),
                    await Re(m, "favorite"),
                    await Le(m, E, I, "watched", B, P, D, K),
                    await Re(m, "watched"),
                    (await ke(m, E, "user_watchlist")) &&
                    (await Ie(m, E, "user_watchlist"),
                      await xe(m, "watchlater")))
                  : g === "watchlater" &&
                  (await Le(m, E, I, "watchlater", B, P, D, K),
                    await Re(m, "watchlater"),
                    (await ke(m, E, "watched_items")) &&
                    (await Ie(m, E, "watched_items"), await xe(m, "watched")),
                    (await ke(m, E, "favorite_items")) &&
                    (await Ie(m, E, "favorite_items"),
                      await xe(m, "favorite"))),
                S(!0),
                V(!0);
            } catch (te) {
              S(!1, te.message), V(!1);
            }
          }),
            (R.onclick = () => {
              (p.style.display = "none"), S(!1), V(!1);
            });
        })
      );
    }
    async function ke(g, w, S) {
      const { data: _, error: m } = await G.from(S)
        .select("*")
        .eq("user_id", g)
        .eq("item_id", w);
      return m ? (console.error(`Error checking ${S}:`, m), !1) : _.length > 0;
    }
    async function Ee(g, w) {
      if (!g) {
        (l.textContent = "Please enter a search query"),
          (l.style.color = "#facc15"),
          (h.innerHTML = ""),
          (pagination.style.display = "none");
        return;
      }
      (l.textContent = "Loading..."),
        (l.style.color = "#60a5fa"),
        (h.innerHTML = ""),
        (pagination.style.display = "none");
      try {
        const S = `https://api.themoviedb.org/3/search/${c.value || "movie"
          }?api_key=${Dr}&query=${encodeURIComponent(g)}&page=${M}`,
          _ = await fetch(S);
        if (!_.ok) throw new Error("Failed to fetch TMDB data");
        const m = await _.json();
        if (((tt = m.results), (Ce = m.total_pages), tt.length === 0)) {
          (l.textContent = "No results found"), (l.style.color = "#facc15");
          return;
        }
        (l.textContent = ""),
          (pagination.style.display = "flex"),
          (f.textContent = `Page ${M} of ${Ce}`),
          (u.disabled = M === 1),
          (d.disabled = M === Ce);
        for (const E of tt) {
          const I = document.createElement("div");
          I.className = "grid-item";
          const B = document.createElement("img");
          B.src = E.poster_path
            ? `https://image.tmdb.org/t/p/w185${E.poster_path}`
            : "../images/no-photo.webp";
          const P = document.createElement("a");
          (P.textContent = E.title || E.name || "Unknown"),
            (P.href = `https://letsee-dusky.vercel.app/app/${c.value}/${E.id}`),
            (P.target = "_blank"),
            (P.style.color = "white"),
            (P.style.textDecoration = "none"),
            (P.className = "text-sm truncate"),
            (P.onmouseover = () => (P.style.textDecoration = "underline")),
            (P.onmouseout = () => (P.style.textDecoration = "none"));
          const D = document.createElement("p");
          (D.textContent =
            new Date(E.release_date || E.first_air_date || "").getFullYear() ||
            "N/A"),
            (D.className = "text-xs"),
            (D.style.color = "#9ca3af"),
            I.appendChild(B),
            I.appendChild(P),
            I.appendChild(D),
            await Jr(I, E),
            h.appendChild(I);
        }
      } catch (S) {
        (l.textContent = "Error: " + S.message), (l.style.color = "#f87171");
      }
    }
    async function Jr(g, w) {
      const S = await $();
      w.id;
      const _ = [
        { name: "watched", table: "watched_items", color: "#4ade80" },
        { name: "favorite", table: "favorite_items", color: "#facc15" },
        { name: "watchlater", table: "user_watchlist", color: "#60a5fa" },
      ];
      for (const m of _) {
        const E = Hr(m, w, S.id);
        g.appendChild(E);
      }
    }
    function Hr(g, w, S) {
      const _ = document.createElement("button");
      return (
        (_.textContent = g.name),
        (_.style.backgroundColor = g.color),
        (_.style.padding = "8px"),
        (_.style.color = "white"),
        (_.style.border = "none"),
        (_.style.borderRadius = "4px"),
        (_.style.cursor = "pointer"),
        (_.style.margin = "4px"),
        Jt(_, S, w.id, g.table, g.name).then(() => {
          _.addEventListener("click", async () => {
            await zr(g.name, w, async (m, E) => {
              if (m) {
                (_.textContent = `${g.name} (Added)`),
                  (_.className = "disabled"),
                  (_.disabled = !0),
                  (l.textContent = `${g.name} added successfully!`),
                  (l.style.color = g.color),
                  setTimeout(() => (l.textContent = ""), 2e3);
                const I = _.parentElement;
                for (const B of I.getElementsByTagName("button")) {
                  const P = B.textContent.split(" ")[0].toLowerCase(),
                    D =
                      P === "watched"
                        ? "watched_items"
                        : P === "favorite"
                          ? "favorite_items"
                          : "user_watchlist";
                  await Jt(B, S, w.id, D, P);
                }
              } else
                (l.textContent = E || `Failed to update ${g.name}`),
                  (l.style.color = "#f87171");
            });
          });
        }),
        _
      );
    }
    async function Jt(g, w, S, _, m) {
      const E = await ke(w, S, _);
      (g.textContent = E ? `${m} (Added)` : m),
        (g.className = E ? "disabled" : ""),
        (g.disabled = E);
    }
  });
  var st, zt;
  function Nr() {
    return (
      zt ||
      ((zt = 1),
        (st = function () {
          throw new Error(
            "ws does not work in the browser. Browser clients must use the native WebSocket object"
          );
        })),
      st
    );
  }
  var Mr = Nr();
  const Fr = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: rt(Mr) },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
})();
