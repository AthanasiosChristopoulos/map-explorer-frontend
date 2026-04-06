========================================================================================================
// Commands:
laravel new project_name // Create new Laravel Project

Getting started with a new Github project:
    composer install // for a new project, download php dependencies into vendor (reads composer.json to download stuff)
    do the .env thing from the .env.example
    php artisan migrate 
    php artisan db:seed
    
php artisan serve // Starts the Laravel backend server

php artisan install:api // use this to create api.php (dont create api.php manually it doesnt register it as a route)

php artisan make:controller AuthController --resource   // make creates new files inside Laravel project. --resource gives extra methods like index(), store()
php artisan make:controller TicketController --resource --model=Ticket --requests   // makes also TicketResource, StoreTicketRequest
                                                                                    //  and UpdateTicketRequest
php artisan make:request NameOfRequest 
     
php artisan make:middleware ClientMiddleware
php artisan make:resource TicketResource // creates class that extends JsonResource, manages the JSON resource

php artisan make:model Ticket -m -f // Ticket is the new class that extends Model, which represents a database table. 
                                    // -m, -f => migration, factory (Create migration file and factory class for this model) 
                                    // A Model can have the hasFactory trait and you can generate new instances using User::factory(10)->create();

php artisan make:factory CountryFactory --model=Country // make factory on the model country

php artisan migrate // first run the migration, creating new SQL schema (CREATE TABLE) and putting the new tables in the database
php artisan migrate --seed // Make tables and seed the database as well
php artisan migrate:fresh // drop all the tables first, then rerun migrations
php artisan migrate:reset // Rolls back all migrations, using down()

php artisan db:show // show Database connection settings + tables
php artisan db:seed // run the run() function on DatabaseSeeder (DatabaseSeeder::run()). This is a PHP class to insert data into your database automatically.
php artisan db:seed --class=CategoriesTableSeeder // runs seeders one at a time
php artisan session:table // Creates a migration file with the code to make the table named session

php artisan route:clear // clear cached routes
php artisan route:list  // show all routes

php artisan tinker // write PHP commands in here (like actuall PHP code)

-- Unit Tests:
composer require pestphp/pest pestphp/pest-plugin-laravel --dev
php artisan pest:install // Initializes pest in tests/Pest.php

php artisan test                    // Run all tests
php artisan test --group=FindTour   // Run specific group of tests

// Passport commands:
composer require laravel/passport   // enable sodium extension, Laravel Passport is a package tht implements OAuth2
                                    // puts package in the composer.json and also "reruns" composer install 
php artisan passport:install // sets up Passport globally for your app (creates new tables, oauth_* and runs these migrations) + generates encryption keys
php artisan passport:keys // to skip migration of the tables and just generate keys

php artisan passport:client --client    // generate a client ID and secret. 
                                        // this client is what other projects will use to get access tokens.
php artisan passport:client --client --name="Frontend_Client"

========================================================================================================
// env:
APP_DEBUG=true // in local / dev env, in production: APP_DEBUG=false

========================================================================================================
// Boiler Plate code for Route:
<?php
use Illuminate\Support\Facades\Route; // import route which you are going to use later

Route::get('/hello', function() {
    return response()->json([
        'message' => 'Hello, Laravel'
    ], 200);
});

Route::apiResource('tickets', TicketController::class); // apiResource is a route generator of all the conventional CRUD routes
Route::apiResource('authors.tickets', AuthorTicketsController::class); // URL like: /authors/{author}/tickets
Route::apiResource('tickets', TicketController::class)->except(['update']); // dont use update

// Are mapped to the functions of a resource controller: php artisan make:controller AuthController --resource
index() // GET on /tickets, Route name: "tickets.index"
create() // GET on /tickets/create
store()	// POST	/tickets, Route name: "tickets.store". Also this function returns the object that was just created
show(Ticket $ticket)	// GET	/tickets/{id}, Route name: "tickets.show" for example: /tickets/5 => show(Ticket $ticket) 
                    // Laravel will automatically Query the database with Ticket id = 5, and inject that into $ticket
                    // Equivalent to doing $ticket = Ticket::findOrFail(5);
edit()	// GET	/tickets/{id}/edit	
update() // PUT (define all fields, essentially replace) or PATCH (define 1-to-all fields for update) /tickets/{id}	
destroy() // DELETE	/tickets/{id}

========================================================================================================
// Eloquent Models: the name of Laravel’s ORM (Object-Relational Mapper), has build in Eloquent query builder
// Eloquent Model name: "User", "Comment" => Database name: "users", "comments" (string is written in inherited $tables variable)
// built in functions and executes SQL querries through functions:

User::create($model); // $model needs to have proper JSON fields (the keys need to be the attributes defined in the SQL Table)
User::update($model);
User::delete(); // delete this model instance
User::where('email', $request->email); // User -> Authenticatable -> Model (Authenticatable extends Model)   
User::firstWhere('email', $request->email);
User::all();
User::find($user_id);  // User::findOrFail($user_id) , It will always look in the id column
User::paginate();
User::with('tickets'); // Eloquent looks for a method named tickets() on User and returns the objects found
$ticket->load('user') // fetches the related user from the database.

protected $fillable = ['name','email','password']; // you can MassAssign these 3 items out of all the attributes   
// User::create(['name' => 'AA', 'email' => 'AA']) yes, but MassAssignmentException User::create(['name' => 'AA', 'id' => 'AA'])

// Laravel Conventions:
Each model is singular PascalCase: Tour, Category
table names to be plural snake_case: tours, categories
Laravel expects foreign key columns to be named singular_modelname_id.

// Many-to-Many Relationship / Pivot Tables conventions:
If you have Tour and Category models → Eloquent expects the pivot table to be called: category_tour (based on alphabetical order 'C' comes first than 'T').
    // For pivot tables:
    You must add migration files for them and seed them yourself (using attach/sync to the initial tables)
    You don’t need a factory or model for pivot tables unless you store extra fields in them.

========================================================================================================
// query Builder:
Builder $builder: This is an Eloquent query builder instance. // Eloquent\Builder Eloquent\Model;
$builder = Ticket::query(); // this is the start of the query (no query yet just slowly building the query). It instances / returns Builder

$builder = Ticket::where('user_id', 5)  // this still instances / returns Builder (without query() in the start)
$builder->where('status', 'open'); // status (the first element) is the databse attribute, SELECT * FROM tickets WHERE status = 'open';
$builder->whereBetween('created_at', $dates); 
$builder->whereIn('status', explode(',', $value)); // this is an array of explode(',', $value) == ['C', 'X'], we query if the status is one of those
$builder->orderBy('field_name', $direction); // $direction == 'desc' or 'asc'
$builder->where('title', 'like', $likeStr); // $likeStr must look like '%eum%'

$tickets = $builder->get(); // final query execution of the build up filters. Get all of them
$tickets = $builder->first(); // first(), get only the first, LIMIT 1

// Query scopes are just predefined ways to modify a query builder.
scopeFilter(Builder $builder, QueryFilter $filters) is a query scope, 
    // Laravel automatically removes the scope prefix, filter() -> scopeFilter()
    // It automatically passes the current Eloquent query builder instance as the first argument ($builder).
    // Ticket::where('user_id', $author_id)->filter($filters) => where() creates builder which will get passed on to scopeFilter

========================================================================================================
// Boiler Plate code for Controller:
<?php
namespace App\Http\Controllers; // A namespace is like a folder or a container for your classes, essentially denoting where this class is. 
                                // You need to reference this exact path (or use it) when accessing the class elsewhere in your code.
class AuthController extends Controller // php => class based language, it AuthController inherits from Controller
                                        // this happened here: php artisan make:controller AuthController
{
    public function returnData() {
        return response()->json(['message' => 'nice'], 200); // -> is used to access property or function of an object, 
                                                             // => is used to map keys to values
    }
}

// Use the Controller:
use App\Http\Controllers\AuthController;
Route::get('/hello', [AuthController::class, 'returnData']); // same: Route::get('/hello', 'AuthController@returnData');

========================================================================================================
// Use Traits:
use App\Traits\ApiResponses;
class AuthController extends Controller
{
    use ApiResponses; // all functions of this trait are inherited to AuthController class  
    public function returnData() {
        return $this->success('nice', 200); // $this is referncing the class AuthController, which has gotten the function success() from the trait
    }
}

========================================================================================================
// Migration (PHP wrapper around SQL): Access the database in http://localhost/phpmyadmin
A migration is a PHP file that defines how the corresponding database table should look (columns, types, constraints).
Tells Laravel how to make a schema for a MySQL table. When using:
    php artisan migrate, Laravel runs up() on all migration files and then converts your migration PHP code into SQL queries and sends them to your MySQL database.

Schema::create('tickets', function (Blueprint $table) { // tickets is the name of the new table
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('title');
    $table->text('description');
    $table->string('status');
    $table->timestamps();   // this is shorthand for: $table->timestamp('created_at')->nullable();
                            // $table->timestamp('updated_at')->nullable(); it createsthese two fields
});

========================================================================================================
// Requests:
If request URL is this: /tickets?status=open&priority=high, then Request $request
    request->has('status')  // true. request->has(...) looks for all keys in the input sources: Route parameters, Query Parameters 
                            // and POST/PUT/PATCH payload JSON keys
    request->all()          // returns ['status' => 'open', 'priority' => 'high']
    $request->only('status');   // extracts just the given keys from the input (query params, JSON body, form-data, etc).
                                // returns ['status' => 'open']
    request()->get('status');  // returns open from URL parameter
    request->input('data.attributes.title') // get value from JSON key 'data.attributes.title' from request payload
    
    use Illuminate\Http\Request;
    $request->user() // Checks the currently authenticated “user” (the one with in the current HTTP lifecycle ),
                    // with this oauth_token. Returns an instance of your User model

class LoginUserRequest extends FormRequest // FormRequest adds extra methods like validated() (returns output of rules()), rules(), authorize().
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'], // means that this requires an email as a string and also to be a valid email
            // equivalent: 'email' => 'required|string|email', 'data.attributes.status' => 'required|string|in:A,C,H,X',
            'password' => ['required', 'string', 'min:8']
            'password' => 'sometimes|integer' // means dont run the test if field doesnt exist. This essentially just valiadate type

        ];
    }
    public function messages() { // is returned when validation fails
        return [    // only 'data.attributes.status' is overriding default message with costum one. 
                    // If missing other fields will print the defaunt message
            'data.attributes.status' => 'The data.attributes.status value is invalid. Please use A, C, H, or X.'
        ];
    }
}

========================================================================================================
// Build in stuff:
fake() // Faker, generates random but realistic-looking data 
Stuff like: fake()->name(); fake()->email(); fake()->paragraph(); 
fake()->words(3, true); (true => 3 words in a string, false => 3 words in an array)

Hash::make('password') // takes the string 'password' and converts it to a hash: $2y$12$Mz/ZWXgxh72t...
                       // we still use the string not the hash, the string will be rehashed when it arrives

$param = request()->get('include'); // global request() function to access current HTTP request
                                    // looks for "include" in http://localhost:8000/api?include=author,comments , 
                                    // return $param = "author,comments"
if(!isset($param)) {return false} // no URL parameter named include found
$includeValues = explode(',', strtolower($param)); // "author,comments" → ["author", "comments"]
in_array($relationship, $includeValues); // return true if $relationship element is in $includeValues array

// Three Types of relationships:
Relationship: User 1 ---> * Ticket , One-to-Many
public function user() {// A Tickets belongs to 1 user. 1-to-N relationship, only defines the relationship 
    return $this->belongsTo(User::class, 'user_id'); // assumes user_id foreign key of Ticket to primary key 'id' in User
} // call this only by using $ticket->author (like its a property not a function)                                                   

public function tickets() {    // A user has many tickets. Query this using the user_id in tickets
    return $this->hasMany(Ticket::class);   // you don’t have to specify it if you follow the convention:
                                            // Primary key = id, Foreign key = related_model_name + _id → user_id
}
Relationship: Tour * <--> * Category, Many-to-Many
public function categories() { // for pivot table seeder: $tour->categories()->attach([2, 5]); Means put for one tour with id = 7, rows (7,2) and (7,5)
    return $this->belongsToMany(Category::class, 'category_tour');
}
public function tours() {
    return $this->belongsToMany(Tour::class, 'category_tour');
}

// hasOne vs belongsTo dfference:
hasOne(): the related table holds the foreign key.
belongsTo(): this table holds the foreign key.

route('users.show', ['user' => $this->user_id]) // i.e.: http://127.0.0.1:8000/api/users/5, "users.show" is a named Route,  
                                                //  .../users/{user} and ['user' => $this->user_id] just fills the URL parameter {user}

bool method_exists(object $object, string $method_name) // return true if the method exists in the class / object
str_replace('*', '%', $value); // '*enum*' -> '%enum%'
strpos($text, '-'); // finds the position of a substring inside a string. strpos("-created_at", '-'); => Outputs: 0
substr($sortAttribute, 1); // $sortAttribute='alla', substr($sortAttribute, 1) = 'lla'

dd($variable) // Dump (print to response) and Die (stop requert lifecycle, return)
var_dump($variable) // prints variable in JSON responce

// pluck():
    $users = collect([['id' => 1, 'name' => 'Alice'], ['id' => 2, 'name' => 'Bob'],]);
    $names = $users->pluck('name'); // Result: ['Alice', 'Bob']

    $users = collect([['id' => 1, 'profile' => ['age' => 25]], ['id' => 2, 'profile' => ['age' => 30]],]);
    $ages = $users->pluck('profile.age'); // Result: [25, 30]

========================================================================================================
// JsonResource / Define the JSON that is going t get returned
new TicketResource(Ticket::create($model)); // creates one TicketResource instance, $this behaves like the wrapped
TicketResource::collection(Ticket::all()) // creates multiple TicketResource instances
public function toArray(Request $request): array
{
    return [
        'type' => 'ticket',
        'id' => $this->id,
        'attributes' => [
            'description' => $this->when(
                $request->routeIs('tickets.show'), // show it only for this route
                $this->description
            )
            $this->mergeWhen($request->routeIs('users.*'), [ // shows all of this for a specific condition
                'emailVerifiedAt' => $this->email_verified_at,
                'createdAt' => $this->created_at,
                'udpatedAt' => $this->updated_at,
            ]),
            'includes' => new UserResource($this->whenLoaded('user')) // only include this JSON property if the user is already loaded in the tickets
        ]                                                             // TicketResource::collection(Ticket::with('user')->paginate());, only when this runs
    ]
}
        

========================================================================================================
public function __construct(Request $request)   // constructor, runs automatically when you create an instance of a class. Is inherited to child class
{                                               // class TicketFilter extends QueryFilter
    $this->request = $request;
}
// A method signature is the definition line of a method: (this public function index($author_id, TicketFilter $filters))
public function index($author_id, TicketFilter $filters) // authors/{author}/tickets, Path parameters → function arguments
                                                         // $author_id = {author}, authors/5/tickets => $author_id = 5

// Dependency injection (DI), type-hinted class in the method, otherwise do:
public function index($author_id) {$filters = new TicketFilter(request());} // manually create it

public function index(TicketFilter $filters) // the instance is created automatically by Laravel when the http request arrives
                                             // TicketFilter is found in Laravel's Service container.
                                             // It finds that there is a constructor which needs the current Request            
public function __construct(Request $request) // This came initialty from the HTTP request is passed to the constructor then to the attributes of this class
{
    $this->request = $request;
}

public function store(StoreTicketRequest $request) // new StoreTicketRequest is made (from Request) and authorize() and rules() run
                                                   // the code isnide here gets executed only on successful rules()

========================================================================================================
// URL things:
// http://localhost:8000/api/v1/tickets?filter[status]=C,X&filter[title]=*id*
? // marks the beginning of the query string (URL parameters)
& // separates (concatenates) multiple query parameters
PHP conventions:
foo=bar → ['foo' => 'bar']
foo[bar]=baz → ['foo' => ['bar' => 'baz']]
filter[status]=C,X&filter[title]=*id* :
    [
        'filter' => [
            'status'=> 'C,X',
            'title'=> '*id*',
        ]
    ]

========================================================================================================
// for loops:
$sortAttributes = explode(',', $value);
foreach($sortAttributes as $sortAttribute) { do_stuff($sortAttribute) }

========================================================================================================
Status Codes:
200 => Success

Header:
Accept: application/json // expect a JSON object return

MySQL => http://localhost/phpmyadmin/
postgresSQL => pgAdmin

========================================================================================================
OAuth2 / Laravel Passport:

// 1) Run commands
// 2) Define guard in config/auth.php for /api/ route. Each guard specifies:
'api' => [
    'driver' => 'passport', // A driver, the mechanism for authentication (the passport)
    'provider' => 'users',  // a provider, the model users come from (the Model user)
    'hash' => false,
],
// 3) Implement login, register routes for Auth controller
// Token Generation:
    // Put HasApiTokens to user:
    use Laravel\Sanctum\HasApiTokens; or use Laravel\Passport\HasApiTokens;
    use HasApiTokens; // trait, injects functions like createToken()
    // Use createToken
    $user->createToken('API token for ' . $user->email)->accessToken // Passport
    $user->createToken('API token for ' . $user->email)->plainTextToken // Sanctum
                    // String concatination, this string It’s just a name for the token to identify it later.
    // Other functions: currentAccessToken(), tokens(), tokens()->delete()
    // Authenticate User (Auth finds this from auth.php, the User is the provider)
    if (Auth::attempt($request->only('email', 'password'))) { // tries to log the user in with the given email/password.
                                                              // marks request/session as authenticated
        $user = Auth::user(); // get the already logged-in user in this request lifecycle / he user authenticated for this request
    }
// 4) Use middleware in Routes neccessary (works for client (machine-to-machine) and user authentication):
middleware('auth') // Auth is defined in auth.php. This accesses the default guard
Route::middleware('auth:api')->get(...) // goes to auth.php, finds 'api' in guards and uses 'passport' as the authentication guard
Route::middleware('auth:sanctum')->get(...) // Sanctum == authentication guard
Route::middleware('auth:sanctum')->group(function() { ... all Routes the require validation ...})
    // if the request passes the sanctum quard, then the request will have a User model, returned by $request->user()
    // middleware(['auth', 'verify']), means go through auth and then verify middleware
// 5) Set up OAuth2 Client:
POST 'http://localhost:8000/oauth/token', Content-Type: application/json // This returns a JWT access token to the client
// JWT (JSON Web tokens) is converted on server, Passport extracts the jti from the JWT. oauth_access_tokens.id = jti
{
    "grant_type": "client_credentials",
    "client_id": "0198d756-572c-7278-9504-1c7c64e262ef",
    "client_secret": "IwwkMhSVQsdPAe7huVWx8pX8CIQtvniPuCFkX88l",
    "scope": ""
}
// JWT is a string separated by 2 dots: HEADER.PAYLOAD.SIGNATURE, in Payload there is the jti

========================================================================================================
Unit tests:
// To register a test for pest to find you need to: 1) Put it under Unit or Features, 2) name it ...Test.php
describe('Find tour tests', function() {
    test('No token failure', function (){
        $response = $this->get('/api/find_tour', [
            'Accept' => 'application/json'
        ]);
        $response->assertStatus(401); // as long as this assert doesnt fail, test is successful
    });
})->group('FindTour');
 
