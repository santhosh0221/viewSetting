sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter'
], function (Controller, JSONModel, Sorter, Filter) {
	"use strict";

	return Controller.extend("assignment.viewSetting.controller.mainView", {
		onInit: function () {
			debugger;
			this._mViewSettingsDialogs = {};
			var oModel = new JSONModel(sap.ui.require.toUrl("assignment/viewSetting/model") + "/dataBase.json");
			this.getView().setModel(oModel);

			this.mGroupFunctions = {
				name: function (oContext) {
					var name = oContext.getProperty("name");
					return {
						key: name,
						text: name
					};
				},
				Price: function (oContext) {
					var price = oContext.getProperty("Price");
					var currency = oContext.getProperty("currency");
					var key, text;
					if (price <= 30000) {
						key = "LE30000";
						text = "30000 " + currency + " or less";
					} else if (price <= 50000) {
						key = "BT30000-50000";
						text = "Between 30000 and 50000 " + currency;
					} else {
						key = "GT50000";
						text = "More than 50000 " + currency;
					}
					return {
						key: key,
						text: text
					};
				}
			};
		},
		onExit: function () {
			debugger;
			if (this.showSort) {
				this.showSort.destroy();
			}
		},
		onPressSort: function () {
			debugger;
			if (!this.showSort) {
				this.showSort = new sap.ui.xmlfragment(this.getView().getId("sort"), "assignment.viewSetting.fragments.sort",
					this);
				this.getView().addDependent(this.showSort);
			}
			this.showSort.open();
		},
		onPressGroup: function () {
			if (!this.showGroup) {
				this.showGroup = new sap.ui.xmlfragment(this.getView().getId("group"), "assignment.viewSetting.fragments.group",
					this);
				this.getView().addDependent(this.showGroup);
			}
			this.showGroup.open();
		},
		showFilter: null,
		onPressFilter: function () {
			if (!this.showFilter) {
				this.showFilter = new sap.ui.xmlfragment(this.getView().getId("filter"), "assignment.viewSetting.fragments.filter",
					this);
				this.getView().addDependent(this.showFilter);
			}

			debugger;
			var oFilter = this.getOwnerComponent().getModel().getProperty("/Product");
			var filterData = [];
			var uniqueData = [];
			var temp = new sap.ui.model.json.JSONModel();
			for (var i = 0; i < oFilter.length; i++) {
				filterData[i] = oFilter[i].brand;
			}
			var unique = [...new Set(filterData)];

			for (var j = 0; j < unique.length; j++) {
				var obj = {
					text: unique[j],
					key: "brand___EQ___" + unique[j] + "___X"
				}
				uniqueData.push(obj);
			}
			this.getOwnerComponent().setModel(temp, "filter");
			this.getOwnerComponent().getModel("filter").setProperty("/sortBrand", uniqueData);
			this.showFilter.bindElement("/sortBrand")
			this.showFilter.open();

		},
		onConformFilter: function (oEvent) {
			debugger;
			var oTable = this.byId("mainTableId"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [];

			mParams.filterItems.forEach(function (oItem) {
				var aSplit = oItem.getKey().split("___"),
					sPath = aSplit[0],
					sOperator = aSplit[1],
					sValue1 = aSplit[2],
					sValue2 = aSplit[3],
					oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);
			});

			// apply filter settings
			oBinding.filter(aFilters);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		},
		onConformSort: function (oEvent) {
			debugger;
			var oTable = this.byId("mainTableId"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},
		onConformGroup: function (oEvent) {
			debugger;
			var oTable = this.byId("mainTableId"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				oBinding.sort(aGroups);
			}
		},
		onAfterRendering: function () {

			// this.getOwnerComponent().
		}

	});
});