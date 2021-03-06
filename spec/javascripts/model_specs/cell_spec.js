describe("Cell", function() {
	var cell;
	var module;

	beforeEach(function() {
		cell = new Model.Cell();
	});

	it("should have a creation date", function() {
		expect( cell.creation ).toBeDefined();
	});
	
	it("should have a (create) url", function() {
		expect( cell.url ).toBeDefined();
		expect( cell.url ).toBe('/cells.json');
	});
	
	it("should have an id", function() {
		expect( cell.id ).toBeDefined();
	});
	
	it("should be marked local", function() {
		expect( cell.isLocal ).toBeTruthy();
	});
	
	it("should be local id-ed", function() {
		var data = Model.Cell.extractId( cell.id );
		expect( data.origin ).not.toBe( 'server' );
	});

	// mixin: timemachine
	it("should have an undotree", function() {
		expect( cell.tree ).toBeDefined();
	});
	
	// mixin:  event bindings
	it("should have event bindings", function() {
		expect( cell._bindings ).toBeDefined();
	});

	// mixin: dynamic properties
	it("should have dynamic properties", function() {
		expect( cell._dynamicProperties ).toBeDefined();
	});
	
	it("should accept custom params", function() {
		cell = new Model.Cell( { name: "custom_name"} );
		expect( cell ).toBeDefined();
	});

	it("should accept a custom start time", function() {
		cell = new Model.Cell( undefined, 2 );
		expect( cell ).toBeDefined();
	})
	
	it("should accept a custom cell params object", function() {
		cell = new Model.Cell( undefined, undefined, { id: 3 } );
		expect( cell ).toBeDefined();
	})
	
	it("should be able to serialize the cell", function() {
		serialized = cell.serialize( true )
		expect( serialized ).toBeDefined();
		expect( serialized.length ).toBeGreaterThan( 2 )
	});
	
	describe("when serialized", function() {

		var serialized;
		beforeEach( function() {
			serialized = cell.serialize( true )
		});
		
		it("should be able to deserialize the cell", function() {
			deserialized = Model.Cell.deserialize( serialized )
			expect( deserialized ).toBeDefined();
		});
		
		describe("and then deserialized", function() {

			var deserialized;
			beforeEach( function() {
				deserialized = Model.Cell.deserialize( serialized )
			});
			
			it("should have a creation date", function() {
				expect( cell.creation ).toBeDefined();
			});

			it("should have a (create) url", function() {
				expect( cell.url ).toBeDefined();
				expect( cell.url ).toBe('/cells.json');
			});

			it("should have an id", function() {
				expect( cell.id ).toBeDefined();
			});

			it("should be marked local", function() {
				expect( cell.isLocal ).toBeTruthy();
			});

			it("should be local id-ed", function() {
				var data = Model.Cell.extractId( cell.id );
				expect( data.origin ).not.toBe( 'server' );
			});

			// mixin: timemachine
			it("should have an undotree", function() {
				expect( cell.tree ).toBeDefined();
			});

			// mixin:  event bindings
			it("should have event bindings", function() {
				expect( cell._bindings ).toBeDefined();
			});

			// mixin: dynamic properties
			it("should have dynamic properties", function() {
				expect( cell._dynamicProperties ).toBeDefined();
			});			
		});
	});
	
	describe("when custom cell parameters include id", function() {
	
		var id = 3;
		beforeEach(function() {
			cell = new Model.Cell( undefined, undefined, { id: id } );
		});
		
		it("should have that id", function() {
			expect( cell.id ).toBe( id );
		});
		
		it("should not be local", function() {
			expect( cell.isLocal() ).toBeFalsy();
		});
		
		it("should have an update url", function() {
			expect( cell.url ).toBe('/cells/' + id + '.json');
		});
	});
  
	describe("when a module has been added", function() {
		var old;
		beforeEach(function() {
			module = new Model.Module()

			old = cell.tree.current;

			cell.add( module );
		});

		it("should have that module", function() {
			expect( cell.has( module ) ).toBeTruthy();
		});
		
		it("should be able to remove that module", function() {
			cell.remove( module );
			expect( cell.has( module ) ).toBeFalsy();
		});

		it("should have added a node to the undotree", function() {
			expect( cell.tree.current.parent ).toBe( old );
		});

	});
	
	describe("when a metabolite has been added", function() {
		var metabolite_name = 'mock#ext';
		var metabolite_amount = 42;
		var metabolite_supply = 2;
		var placement = Model.Metabolite.Outside;
		var type = Model.Metabolite.Substrate;
		
		beforeEach(function() {
			cell.addMetabolite( metabolite_name, metabolite_amount, metabolite_supply, false, false );
		});
		
		it("should have that metabolite", function() {
			expect( cell.hasMetabolite( metabolite_name ) ).toBeTruthy();
			metabolite = cell.getMetabolite( metabolite_name );
			expect( metabolite ).toBeDefined();
			expect( metabolite ).not.toBe( null );
		});
		
		it("should have the amount specified", function() {
			expect( cell.amountOf( metabolite_name ) ).toBe( metabolite_amount );
			metabolite = cell.getMetabolite( metabolite_name );
			expect( metabolite.amount ).toBe( metabolite_amount );
		});
		
		it("should have the supply specified", function() {
			metabolite = cell.getMetabolite( metabolite_name );
			expect( metabolite.supply ).toBe( metabolite_supply );
		});
		
		it("should have the type specified", function() {
			metabolite = cell.getMetabolite( metabolite_name );
			expect( metabolite.type ).toBe( type );
		});
		
		it("should have the placement specified", function() {
			metabolite = cell.getMetabolite( metabolite_name );
			expect( metabolite.placement ).toBe( placement );
		});
		
		describe( "and parameters are not given", function() {
			beforeEach(function() {
				metabolite_name = 'foo#ext';
				cell.addMetabolite( metabolite_name );
			});
			
			it("should have the defaults", function() {
				metabolite = cell.getMetabolite( metabolite_name );
				expect( metabolite.supply ).toBe( 1 );
				expect( metabolite.type ).toBe( Model.Metabolite.Substrate );
				expect( metabolite.placement ).toBe( Model.Metabolite.Outside );
			});
		});
	});
	
	describe("when a module that is a metabolite has been added", function() {
	
		var module =  new Model.Metabolite( 'foo' );
		beforeEach(function() {
			spyOn( Model.Cell.prototype, 'addMetaboliteModule' );
			cell.add( module );
		});
		
		it("should have added that module as metabolite", function() {
			expect( Model.Cell.prototype.addMetaboliteModule ).toHaveBeenCalledWith( module, true );
		});
		
	});
	
	describe("when an external substrate has been added", function() {
	
		var substrate_name = 'mock#ext';
		var substrate_amount = 42;
		var substrate_supply = 2;
		var placement = Model.Metabolite.Outside;
		var type = Model.Metabolite.Substrate;
		
		beforeEach(function() {
			cell.addSubstrate( substrate_name, substrate_amount, substrate_supply, false );
		});
		
		it("should have that substrate", function() {
			expect( cell.hasSubstrate( substrate_name ) ).toBeTruthy();
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate ).toBeDefined();
			expect( substrate ).not.toBe( null );
		});
		
		it("should have the amount specified", function() {
			expect( cell.amountOf( substrate_name ) ).toBe( substrate_amount );
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.amount ).toBe( substrate_amount );
		});
		
		it("should have the supply specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.supply ).toBe( substrate_supply );
		});
		
		it("should have the type specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.type ).toBe( type );
		});
		
		it("should have the placement specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.placement ).toBe( placement );
		});

		it("should be able to remove that substrate", function() {
			cell.removeSubstrate( substrate_name );
			expect( cell.hasSubstrate( substrate_name ) ).toBeFalsy();
			expect( cell.getSubstrate( substrate_name ) ).not.toBeDefined();
			expect( cell.amountOf( substrate_name ) ).not.toBeDefined();
		});
			
		it("should replace the substrate amount if it already exists", function () {
			substrate = cell.getSubstrate( substrate_name );
			cell.addSubstrate( substrate_name, substrate_amount + 1, substrate_supply, false );
			expect( substrate ).toBe( cell.getSubstrate( substrate_name ) );
			expect( cell.amountOf( substrate_name ) ).toBe( substrate_amount + 1 );
			expect( substrate.amount ).toBe( substrate_amount + 1 );
		});
		
		describe( "and parameters are not given", function() {
			beforeEach(function() {
				metabolite_name = 'foo#ext';
				cell.addSubstrate( metabolite_name );
			});
			
			it("should have the defaults", function() {
				metabolite = cell.getMetabolite( metabolite_name );
				expect( metabolite.supply ).toBe( 1 );
				expect( metabolite.type ).toBe( Model.Metabolite.Substrate );
				expect( metabolite.placement ).toBe( Model.Metabolite.Outside );
			});
		});
		
	});
	
	describe("when an internal substrate has been added", function() {
	
		var substrate_name = 'mock#int';
		var substrate_amount = 42;
		var substrate_supply = 2;
		var placement = Model.Metabolite.Inside;
		var type = Model.Metabolite.Substrate;
		
		beforeEach(function() {
			cell.addSubstrate( substrate_name, substrate_amount, substrate_supply, true );
		});
		
		it("should have that substrate", function() {
			expect( cell.hasSubstrate( substrate_name ) ).toBeTruthy();
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate ).toBeDefined();
			expect( substrate ).not.toBe( null );
		});
		
		it("should have the amount specified", function() {
			expect( cell.amountOf( substrate_name ) ).toBe( substrate_amount );
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.amount ).toBe( substrate_amount );
		});
		
		it("should have the supply specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.supply ).toBe( substrate_supply );
		});
		
		it("should have the type specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.type ).toBe( type );
		});
		
		it("should have the placement specified", function() {
			substrate = cell.getSubstrate( substrate_name );
			expect( substrate.placement ).toBe( placement );
		});

		it("should be able to remove that substrate", function() {
			cell.removeSubstrate( substrate_name );
			expect( cell.hasSubstrate( substrate_name ) ).toBeFalsy();
			expect( cell.getSubstrate( substrate_name ) ).not.toBeDefined();
			expect( cell.amountOf( substrate_name ) ).not.toBeDefined();
		});
			
		it("should replace the substrate amount if it already exists", function () {
			substrate = cell.getSubstrate( substrate_name );
			cell.addSubstrate( substrate_name, substrate_amount + 1, substrate_supply, true );
			expect( substrate ).toBe( cell.getSubstrate( substrate_name ) );
			expect( cell.amountOf( substrate_name ) ).toBe( substrate_amount + 1 );
			expect( substrate.amount ).toBe( substrate_amount + 1 );
		});

	});
		
	describe("when a metabolite is added", function() {
	
		var substrate_amount = 42;
		var substrate_supply = 2;

		it("can be an external substrate", function() {
		
			var placement = Model.Metabolite.Outside;
			var type = Model.Metabolite.Substrate;
		
			cell.addSubstrate( 'e_substrate#ext', substrate_amount, substrate_supply, false );
			expect( cell.hasSubstrate( 'e_substrate#ext'  ) ).toBeTruthy();
			substrate = cell.getSubstrate( 'e_substrate#ext' );
			expect( substrate.placement ).toBe( placement );
			expect( substrate.type ).toBe( type );
		});
		
		it("can be an internal substrate", function() {
		
			var placement = Model.Metabolite.Inside;
			var type = Model.Metabolite.Substrate;
		
			cell.addSubstrate( 'i_substrate#int', substrate_amount, substrate_supply, true );
			expect( cell.hasSubstrate( 'i_substrate#int'  ) ).toBeTruthy();
			substrate = cell.getSubstrate( 'i_substrate#int' );
			expect( substrate.placement ).toBe( placement );
			expect( substrate.type ).toBe( type );
		});
		
		
		it("can be an internal product", function() {
		
			var placement = Model.Metabolite.Inside;
			var type = Model.Metabolite.Product;
		
			cell.addProduct( 'i_product#int', substrate_amount, true );
			expect( cell.hasProduct( 'i_product#int'  ) ).toBeTruthy();
			substrate = cell.getProduct( 'i_product#int' );
			expect( substrate.placement ).toBe( placement );
			expect( substrate.type ).toBe( type );
		});

		it("can be an external product", function() {
		
			var placement = Model.Metabolite.Outside;
			var type = Model.Metabolite.Product;
		
			cell.addProduct( 'e_product#ext', substrate_amount, false );
			expect( cell.hasProduct( 'e_product#ext'  ) ).toBeTruthy();
			substrate = cell.getProduct( 'e_product#ext' );
			expect( substrate.placement ).toBe( placement );
			expect( substrate.type ).toBe( type );
		});
		
		describe("when serialized", function() {

			var placement = Model.Metabolite.Outside;
			var type = Model.Metabolite.Substrate;
			var substrate_name= 'foo#ext';

			var serialized;
			beforeEach( function() {
				cell.addSubstrate( substrate_name, substrate_amount, substrate_supply, false );
				serialized = cell.serialize( true )
			});
			
			it("should be able to deserialize the cell", function() {
				deserialized = Model.Cell.deserialize( serialized )
				expect( deserialized ).toBeDefined();
			});
			
			describe("and then deserialized", function() {

				var deserialized;
				beforeEach( function() {
					deserialized = Model.Cell.deserialize( serialized )
				});
				
				it("should have that substrate", function() {
					expect( cell.hasSubstrate( substrate_name ) ).toBeTruthy();
					substrate = cell.getSubstrate( substrate_name );
					expect( substrate ).toBeDefined();
					expect( substrate ).not.toBe( null );
				});
				
				it("should have the amount specified", function() {
					expect( cell.amountOf( substrate_name ) ).toBe( substrate_amount );
					substrate = cell.getSubstrate( substrate_name );
					expect( substrate.amount ).toBe( substrate_amount );
				});
				
				it("should have the supply specified", function() {
					substrate = cell.getSubstrate( substrate_name );
					expect( substrate.supply ).toBe( substrate_supply );
				});
				
				it("should have the type specified", function() {
					substrate = cell.getSubstrate( substrate_name );
					expect( substrate.type ).toBe( type );
				});
				
				it("should have the placement specified", function() {
					substrate = cell.getSubstrate( substrate_name );
					expect( substrate.placement ).toBe( placement );
				});
			});
		});
	});
	
	describe("when the cell has ran", function() {
		var run_t = 10;
		var result, promise;
		
		beforeEach(function() {
			promise = cell.run( 0, run_t );
		});
		
		it("should have run with t runtime", function() {
			
			waitsFor( function() {
				return promise.state() === "rejected" || promise.state() === "resolved" 
			} )
			
			promise.done( function( r ) { result = r } );
			
			runs( function() {
				expect( promise.state() ).toBe( "resolved" );
				expect( result ).toBeDefined();
				expect( result.results.x ).toBeDefined();
				expect( result.results.x[ 0 ] ).toBe( 0 );
				expect( result.results.x[ result.results.x.length - 1 ] ).toBe( run_t );
			});
			
		});
	});
	
	describe( "and Module Integration", function() {
		var cell;
		var create_transport, transport_food, food_enzyme;
		
		var enzyme = 1;
		var food = 100;

		beforeEach(function() {
			cell = new Model.Cell();
			cell.addSubstrate( 'food', food, 0, false );
			cell.addSubstrate( 'food', 0, 0, true );
				
			create_transport = new Model.Module(
				{ 
					rate: 2, 
					name : 'transp' ,
					starts : { 
						name : 0 
					}
				}, 
				function ( t, substrates ) {
					return { 'transp' : this.rate }
				}
			);

			transport_food = new Model.Module(
				{ rate: 1 },
				function ( t, compounds ) {
					transporters = compounds.transp
					food_out = compounds["food#ext"]
					transport = Math.min( transporters * this.rate, Math.max( 0, food_out ) )
					return { 
						'food#ext' : -transport, 
						'food#int' : transport 
					}
				}
			);

			food_enzyme = new Model.Module(
				{ starts: { name : enzyme }, name: 'enzyme' },
				function ( t, compounds ) {

					food_in = compounds["food#int"]
					enzyme = compounds.enzyme
					processed = Math.min( enzyme, Math.max( 0, food_in ) )
					return { 
						'food#int' : -processed 
					}
				}
			);

			cell.add( create_transport )
				.add( transport_food )
				.add( food_enzyme )
		});

		describe( "when ran for 0 seconds", function() {
			var results, result, mapping, promise;
			
			beforeEach(function() {
				promise = cell.run( 0, 0 );
				promise.done( function( r ) { results = r } );
				waitsFor( function() {
					return promise.state() === "rejected" || promise.state() === "resolved" 
				} );
				
			});

			it("should have input values", function() {
			
				runs( function() {
					result = results.results;
					mapping = results.map;
				
					expect( result ).toBeDefined();
					expect( result.y[ result.y.length - 1 ][ mapping.enzyme ] ).toBe( enzyme );
					expect( result.y[ result.y.length - 1 ][ mapping["food#ext"] ] ).toBe( food );
					expect( result.y[ result.y.length - 1 ][ mapping["food#int"] ] ).toBe( 0 );
					expect( result.y[ result.y.length - 1 ][ mapping.transp ] ).toBe( 0 );
				
				});
			});
			
		});
		
		describe( "when ran for 2 seconds", function() {
			var result, mapping, promise;
			
			beforeEach(function() {
				promise = cell.run( 0, 2 );
				promise.done( function( r ) { results = r } );
				waitsFor( function() {
					return promise.state() === "rejected" || promise.state() === "resolved" 
				} );
			});

			it("should have kept all the enzym", function() {
				runs( function() {
					result = results.results;
					mapping = results.map;
					expect( result.y[ result.y.length - 1 ][ mapping.enzyme ] ).toBe( enzyme );
				});
			});
			
			it("should have created transporters", function() {
				runs( function() {
					result = results.results;
					mapping = results.map;
					expect( result.y[ result.y.length - 1 ][ mapping.transp ] ).toBeCloseTo( create_transport.rate * 2 );
				});
			});
			
			it("should have transported food", function() {
				runs( function() {
					result = results.results;
					mapping = results.map;
					expect( result.y[ result.y.length - 1 ][ mapping["food#int"] ] ).toBeGreaterThan( 0 );
					expect( result.y[ result.y.length - 1 ][ mapping["food#ext"] ] ).toBeLessThan( food );
				});
			});
			
			it("should have consumed food", function() {
				runs( function() {
					result = results.results;
					mapping = results.map;
					expect( 
						result.y[ result.y.length - 1 ][ mapping["food#int"] ] + 
						result.y[ result.y.length - 1 ][ mapping["food#ext"] ] 
					).toBeLessThan( food );
				});
			});

			it("should summed up the rate if a second transporter uses the same substrate", function() {
				create_transport_2 = new Model.Module(
					{ 
						rate: 2, 
						name : 'transp' ,
						starts : { 
							name : 0 
						}
					}, 
					function ( t, substrates ) {
						return { 'transp' : this.rate }
					}
				);

				cell.add( create_transport_2 );

				promise = cell.run( 0, 2 );
				promise.done( function( r ) { results = r } );
				waitsFor( function() {
					return promise.state() === "rejected" || promise.state() === "resolved" 
				} );
				
				runs(function() {
					result = results.results;
					mapping = results.map;

					expect( result.y[ result.y.length - 1 ][ mapping.transp ] ).
						toBeCloseTo( (create_transport.rate + create_transport_2.rate) * 2);
				});
			});
			
		});
		
		xdescribe( "serialized and deserilized, should retain substrates, modules, cell", function() {
		
		});
	});
	
	it(".extractId should accept objects", function() {
		var id = { id: 1 }
		var data = Model.Cell.extractId( id );
		expect( data ).toBe( id );
	});
	
	it(".extractId should accept numbers", function() {
		var id = 1
		var data = Model.Cell.extractId( id );
		expect( data.id ).toBe( id );
		expect( data.origin ).toBe( 'server' );
	});
	
	it(".extractId should accept numbers as string", function() {
		var id = '1'
		var data = Model.Cell.extractId( id );
		expect( data.id ).toBe( parseInt( id ) );
		expect( data.origin ).toBe( 'server' );
	});
	
	it(".extractId should accept string data", function() {
		var id = 'limbo::1'
		var data = Model.Cell.extractId( id );
		expect( data.id ).toBe( 1 );
		expect( data.origin ).toBe( 'limbo' );
	});
	
	it(".extractId should not accept other types", function() {
		var id = undefined;
		var data = Model.Cell.extractId( id );
		expect( data ).toBe( null );
	});
	
	xdescribe( "when the cell is saved", function() {
	
	});
	
	xdescribe( "when the cell is loaded", function() {
	
	});
	
});
